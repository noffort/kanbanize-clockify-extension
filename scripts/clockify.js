const apiKey = 'YOUR_API_KEY'; // Replace with your Clockify API key
const baseUrl = 'https://api.clockify.me/api/v1';

// Set up the common headers for Clockify API requests
const headers = {
  'X-Api-Key': apiKey,
  'Content-Type': 'application/json',
};

// Function to authenticate and get user data
async function auth() {
  try {
    const response = await fetch(`${baseUrl}/user`, { headers });

    if (!response.ok) {
      throw new Error(`Authentication failed with status ${response.status}`);
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

// Function to get a list of workspaces
async function getWorkspaces() {
  try {
    const response = await fetch(`${baseUrl}/workspaces`, { headers });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const workspaces = await response.json();
    return workspaces;
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    throw error;
  }
}

// Function to get a list of tasks within a workspace
async function getTasks(workspaceId) {
  try {
    const response = await fetch(`${baseUrl}/workspaces/${workspaceId}/tasks`, { headers });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const tasks = await response.json();
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

// Function to create a new task within a workspace
async function createTask(workspaceId, taskData) {
  try {
    const response = await fetch(`${baseUrl}/workspaces/${workspaceId}/tasks`, {
      method: 'POST',
      headers,
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const createdTask = await response.json();
    return createdTask;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

// Function to start a timer for a task
async function startTimer(workspaceId, taskId) {
  try {
    const response = await fetch(`${baseUrl}/workspaces/${workspaceId}/timeEntries`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ taskId }),
    });

    if (!response.ok) {
      throw new Error(`Timer start failed with status ${response.status}`);
    }

    const timerData = await response.json();
    return timerData;
  } catch (error) {
    console.error('Error starting timer:', error);
    throw error;
  }
}

// Function to stop the active timer
async function stopTimer(workspaceId) {
  try {
    const response = await fetch(`${baseUrl}/workspaces/${workspaceId}/timeEntries/current`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ end: new Date().toISOString() }),
    });

    if (!response.ok) {
      throw new Error(`Timer stop failed with status ${response.status}`);
    }

    const stoppedTimerData = await response.json();
    return stoppedTimerData;
  } catch (error) {
    console.error('Error stopping timer:', error);
    throw error;
  }
}

// Example usage:
auth()
  .then((userData) => {
    console.log('User Data:', userData);

    // Replace 'workspaceId' with the actual ID of your workspace
    getWorkspaces()
      .then((workspaces) => {
        console.log('List of Workspaces:', workspaces);

        // Replace 'workspaceId' with the actual ID of the workspace you want to fetch tasks from
        getTasks('workspaceId')
          .then((tasks) => {
            console.log('List of Tasks:', tasks);
          })
          .catch((error) => {
            console.error('Error fetching tasks:', error);
          });

        // Replace 'workspaceId' and 'taskData' with actual values for creating a task
        const taskData = {
          name: 'Sample Task',
          projectId: 'project_id',
          assigneeIds: ['user_id'],
        };

        createTask('workspaceId', taskData)
          .then((createdTask) => {
            console.log('Created Task:', createdTask);

            // Replace 'workspaceId' and 'taskId' with actual values for starting a timer
            startTimer('workspaceId', 'taskId')
              .then((timerData) => {
                console.log('Started Timer:', timerData);
              })
              .catch((error) => {
                console.error('Error starting timer:', error);
              });
          })
          .catch((error) => {
            console.error('Error creating task:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching workspaces:', error);
      });
  })
  .catch((error) => {
    console.error('Authentication error:', error);
  });

// To stop the active timer, call stopTimer with the workspace ID
// stopTimer('workspaceId')
//   .then((stoppedTimerData) => {
//     console.log('Stopped Timer:', stoppedTimerData);
//   })
//   .catch((error) => {
//     console.error('Error stopping timer:', error);
//   });
