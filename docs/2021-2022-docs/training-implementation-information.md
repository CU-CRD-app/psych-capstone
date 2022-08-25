# Training Implementation Information

When figuring out how to remove the tedious daily and pre-training assessments, we found that there was little to no documentation left by prior teams on how all this worked, how user data was structured/retrieved from the backend, etc. so we wanted to provide some information on our understanding of how training is implemented, such that future teams may be able to more easily ramp up on the codebase.

## Backend UserData and Training API

### 1. UserData API Endpoint

The ```/userData``` endpoint in the backend API is the main resource that all pages in the front-end application send requests to in order to retrieve data about the logged-in user.

This API endpoint accepts POST requests which contain a valid JWT in their Authorization header. When a request comes in, the backend service first validates the token, and then extracts the ```userid``` contained in the JWT to retrive user data via the ```userData.js``` module.

The ```userData(id)``` function within the ```userData.js``` module first selects rows from the ```day```, ```preassessment```, and ```postassessment``` tables which belong to the userid provided in the function call. After retrieving the pertinent rows, the function checks whether any rows were returned from the pre and post assessment tables, and if so, sets the pre and postassessment elements of the Javascript object that will be returned on function end accordingly, setting the score and date attributes of these sections of the object.

Next, the function iterates over each returned row from the days table, and as long as all score values in the current row are not -1, it increments a 'level' counter and continues to the next row. This seems to be how previous teams decided to determine which level a user is currently on, since theoretically only the currently in-progress level should have score values of -1 at some point in the row.

Once the user's current level has been determined, a Javascript object with the following structure is returned by the function which ultimately is returned as the response to the POST request received by the backend:

```
{
    days: [
        {
            userid: ...,
            level: ...,
            race: ...,
            date: ...,
            nameface: ...,
            whosnew: ...,
            memory: ...,
            shuffle: ...,
            forcedchoice: ...,
            samedifferent: ...,
        },
        ...
    ],
    race: ...,
    level: ...,
    pre: {
        score: ...,
        date: ...
    },
    post: {
        score: ...,
        date: ...
    }
}
```

## 2. Score Submission API Endpoint

Throughout a training cycle, after each completed minigame, the front-end application persists score data in the database through the ```/tasks``` API endpoint, which handles the submission of scores into the ```day``` table.

The API endpoint takes in a request body of the following structure, with a valid JWT in the Authorization header of the request:

```
        "level": this.level,
        "race": this.race,
        "shuffle": this.shuffle,
        "memory": this.memory,
        "whosnew": this.whosnew,
        "nameface": this.nameface,
        "forcedchoice": this.forcedchoice,
        "samedifferent": this.samedifferent
      };
```



## 1. User Dashboard

When a user first enters their dashboard, a notification is scheduled for the next day to remind the user to return and complete their training the following day. Next, the frontend makes a call to the backend ```/userData``` API endpoint, to retrieve pertinent information about the logged in user as detailed above.

Once the information is retrieved, the dashboard front-end code determines what the last complete day of training was that the user completed, by iterating over the ```days``` field returned in the ```/userData``` response. The dashboard uses this information to display both the user's current level, and the user's progress in their training.

## 2. Training Page

The training page is where the user goes to commence their training on a particular day. When the user enters the page, a function is called which retrieves data from the ```/userData``` API endpoint, and sets the current level to the level returned by the API.

Next, similar to on the User Dashboard, the training page determines what the last day the user completed training on was, by finding the most recent date which contains no -1 score values. If the last complete day of training is the current day, then an animation is played showing the user that they have already completed training for the day, and to come back tomorrow.

Otherwise, if no training has been completes, then a list of training faces are generated, and the page moves to the training selection menu, where the user can choose from a variety of training tasks. On completion of each task, the user's score is uploaded to the current row in the ```day```, and once all tasks are complete, the user has the option to finish training for the day, which publishes the final scores to the ```day``` table, increments the user's level, and completes the training, sending them back to the dashboard.
