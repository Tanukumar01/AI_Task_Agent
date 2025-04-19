        document.addEventListener('DOMContentLoaded', () => {
            const taskForm = document.getElementById('taskForm');
            const taskInput = document.getElementById('taskInput');
            const submitTaskBtn = document.getElementById('submitTask');
            const statusPanel = document.getElementById('statusPanel');
            const planContainer = document.getElementById('planContainer');
            const planExplanation = document.getElementById('planExplanation');
            const filesList = document.getElementById('filesList');
            const stepsList = document.getElementById('stepsList');
            const approvePlanBtn = document.getElementById('approvePlan');
            const rejectPlanBtn = document.getElementById('rejectPlan');
            const executionResults = document.getElementById('executionResults');
            const resultsList = document.getElementById('resultsList');
            const taskSucceededBtn = document.getElementById('taskSucceeded');
            const taskFailedBtn = document.getElementById('taskFailed');
            const feedbackForm = document.getElementById('feedbackForm');
            const feedbackInput = document.getElementById('feedbackInput');
            const submitFeedbackBtn = document.getElementById('submitFeedback');
            
            let currentTask = '';
            let currentPlan = null;
            
            // Update status function
            function updateStatus(message, type = 'info') {
                statusPanel.innerHTML = `
                    <div class="status-indicator ${type}">
                        <span>${type === 'info' ? '💡' : type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️'}</span>
                        <span>${message}</span>
                    </div>`;
            }
            
            // Submit a task
            submitTaskBtn.addEventListener('click', async () => {
                const task = taskInput.value.trim();
                if (!task) {
                    updateStatus('Please enter a task description', 'warning');
                    return;
                }
                
                currentTask = task;
                submitTaskBtn.disabled = true;
                submitTaskBtn.innerHTML = '<span class="loading"></span> Processing...';
                updateStatus('Analyzing task and generating plan...', 'info');
                
                try {
                    const response = await fetch('/api/task', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ task })
                    });
                    
                    const data = await response.json();
                    
                    if (data.needsApproval && data.plan) {
                        // Show the plan for approval
                        displayPlan(data.plan);
                        updateStatus('Review the plan below and approve or reject', 'info');
                    } else if (data.error) {
                        updateStatus('Error: ' + data.error, 'error');
                    } else {
                        updateStatus('Something went wrong', 'error');
                    }
                } catch (error) {
                    updateStatus('Failed to communicate with the server: ' + error.message, 'error');
                } finally {
                    submitTaskBtn.disabled = false;
                    submitTaskBtn.textContent = 'Execute Task';
                }
            });
            
            // Display the plan
            function displayPlan(plan) {
                currentPlan = plan;
                
                // Show plan container
                planContainer.classList.remove('hidden');
                
                // Set explanation
                planExplanation.textContent = plan.explanation;
                
                // Display code files
                filesList.innerHTML = '';
                if (plan.code_files && plan.code_files.length > 0) {
                    plan.code_files.forEach(file => {
                        filesList.innerHTML += `
                            <div class="file-item">
                                <div class="file-header">
                                    <span>${file.filename}</span>
                                </div>
                                <div class="file-content">${file.content}</div>
                            </div>`;
                    });
                } else {
                    filesList.innerHTML = '<p>No code files to create.</p>';
                }
                
                // Display steps
                stepsList.innerHTML = '';
                if (plan.steps && plan.steps.length > 0) {
                    plan.steps.forEach((step, index) => {
                        stepsList.innerHTML += `
                            <div class="step-item">
                                <div class="step-number">${index+1}</div>
                                <div class="step-description">
                                    ${step.description}
                                    <div class="step-command">${step.command}</div>
                                </div>
                            </div>`;
                    });
                } else {
                    stepsList.innerHTML = '<p>No commands to execute.</p>';
                }
            }
            
            // Approve plan
            approvePlanBtn.addEventListener('click', async () => {
                if (!currentPlan) return;
                
                approvePlanBtn.disabled = true;
                rejectPlanBtn.disabled = true;
                approvePlanBtn.innerHTML = '<span class="loading"></span> Executing...';
                updateStatus('Executing your task...', 'info');
                
                try {
                    const response = await fetch('/api/approve', {
                        method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ plan: currentPlan, approve: true })
                        });
                        
                        const data = await response.json();
                        
                        // Hide plan container
                        planContainer.classList.add('hidden');
                        
                        if (data.success) {
                            updateStatus('Task executed successfully!', 'success');
                            displayResults(data.results);
                            executionResults.classList.remove('hidden');
                        } else {
                            updateStatus('Task execution failed. See details below.', 'error');
                            displayResults(data.results);
                            executionResults.classList.remove('hidden');
                        }
                    } catch (error) {
                        updateStatus('Failed to execute task: ' + error.message, 'error');
                    } finally {
                        approvePlanBtn.disabled = false;
                        rejectPlanBtn.disabled = false;
                        approvePlanBtn.textContent = 'Approve Plan';
                    }
                });
                
                // Reject plan
                rejectPlanBtn.addEventListener('click', () => {
                    planContainer.classList.add('hidden');
                    updateStatus('Plan rejected. You can modify your task and try again.', 'info');
                    currentPlan = null;
                });
                
                // Display execution results
                function displayResults(results) {
                    resultsList.innerHTML = '';
                    
                    if (!results || results.length === 0) {
                        resultsList.innerHTML = '<p>No results to display.</p>';
                        return;
                    }
                    
                    results.forEach(item => {
                        const success = item.result.success;
                        
                        resultsList.innerHTML += `
                            <div class="result-item">
                                <div class="result-header ${success ? 'success' : 'failure'}">
                                    ${success ? '✅' : '❌'} ${item.step.description}
                                </div>
                                <div class="result-content">
                                    Command: ${item.step.command}
                                    ${item.result.stdout ? '\n\nOutput:\n' + item.result.stdout : ''}
                                    ${item.result.stderr ? '\n\nErrors:\n' + item.result.stderr : ''}
                                    ${item.result.error ? '\n\nError: ' + item.result.error : ''}
                                </div>
                            </div>`;
                    });
                }
                
                // Task succeeded
                taskSucceededBtn.addEventListener('click', () => {
                    updateStatus('🎉 Great! The task was completed successfully.', 'success');
                    executionResults.classList.add('hidden');
                    feedbackForm.classList.add('hidden');
                    currentTask = '';
                    currentPlan = null;
                });
                
                // Task failed
                taskFailedBtn.addEventListener('click', () => {
                    feedbackForm.classList.remove('hidden');
                    updateStatus('Please provide feedback on what went wrong', 'warning');
                });
                
                // Submit feedback
                submitFeedbackBtn.addEventListener('click', async () => {
                    const feedback = feedbackInput.value.trim();
                    
                    if (!feedback) {
                        updateStatus('Please describe what went wrong', 'warning');
                        return;
                    }
                    
                    submitFeedbackBtn.disabled = true;
                    submitFeedbackBtn.innerHTML = '<span class="loading"></span> Processing...';
                    updateStatus('Refining approach based on your feedback...', 'info');
                    
                    try {
                        const response = await fetch('/api/retry', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ originalTask: currentTask, feedback })
                        });
                        
                        const data = await response.json();
                        
                        if (data.needsApproval && data.plan) {
                            // Hide previous sections
                            executionResults.classList.add('hidden');
                            feedbackForm.classList.add('hidden');
                            
                            // Show the new plan for approval
                            displayPlan(data.plan);
                            updateStatus('Here\'s a refined approach based on your feedback. Please review.', 'info');
                        } else if (data.error) {
                            updateStatus('Error: ' + data.error, 'error');
                        }
                    } catch (error) {
                        updateStatus('Failed to process feedback: ' + error.message, 'error');
                    } finally {
                        submitFeedbackBtn.disabled = false;
                        submitFeedbackBtn.textContent = 'Retry with this feedback';
                    }
                });
            });
                            