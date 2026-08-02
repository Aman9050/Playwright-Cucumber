Feature:Login

Background:
Given user navigates into an application
And user  click on login

 Scenario Outline:<Testcaseid>:validate product is added to cart

 And the user enter the username
 And the user enter the password 
 And the user click on login button
 Then user should be login sucessfully
 And user search for Product "<Product>"
 Then Verify "<Product>" is displayed to the user on cart page
 Examples:
 |Product| Testcaseid |
 |Samsung galaxy s6|TC001|
  #  |Nokia lumia 1520|TC002|
    

 





 