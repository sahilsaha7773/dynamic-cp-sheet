# Dynamic CP Sheet 

Inspired by the dynamic a2oj ladder, I decided to make a similar thing for one of the best collections of CP problems. This is the dynamic version of the **Striver’s CP Sheet**(Solely for preparing for Coding Rounds of Top Product Based Companies and to do well in Coding Sites and Competitions).

[Link to the original CP sheet page.](https://takeuforward.org/interview-experience/strivers-cp-sheet/)

Solve problems from the sheet and easily track your progress at https://sahilsaha.me/dynamic-cp-sheet/.

Feel free to open an issue or create a pull request if you face any kind of bug or want a new feature. 

Happy Coding! :)

# Setting up the project

This project is made using React JS, so make sure you have Node JS installed on your machine or you can run the application using Docker.
- Clone the repo.
- Inside the project directory run the following command to install the required `node_modules`.
  ```cmd
  npm i
  ```
- After installing the node_modules run the following command to run the application on PORT `3000`.
  ```cmd
  npm start
  ```

## Using Docker
Make sure you have docker installed on your machine.
- Clone the repo.
- Inside the project directory run :
  ```cmd
  docker build -t cp-sheet:0.0.1 .
  ```
  You can replace cp-sheet:0.0.1 with the tag name you want.
- After succesfully building the docker image, run the image using this command:
  ```cmd
  docker run -p 3001:3000 cp-sheet:0.0.1
  ```
  This will run the application on PORT `3001`.


