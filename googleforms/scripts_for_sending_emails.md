## Steps
- Paste the following into the script file and save the file with an appropriate name.
- Then click "Edit" -> "Current Project's Triggers"
- You will be taken to a new tab/window.
- Click "Add Trigger" at the bottom right and fill out like this:
  - Choose which function to run: onFormSubmit
  - Choose which deploytment should run: Head
  - Select event source: From form
  - Select event type: On form submit
- Save

```javascript

function onFormSubmit(e) {
  
  console.log("Form submitted onFormSubmit");

  
  var responseObject = {};
  var response = null;
  
  try {

    var response = e.response;
    
    /*
    console.log( {       "stack" : "before getting all responses",
      "response" : response,
      e : e} );
    */
    
  } catch (err) {
    console.log( {"throwing error on form submit" : e});
  }
    
  if (response == null) {
    var form = FormApp.getActiveForm();
    var responses = form.getResponses();
    response = responses[0];
  }
  
  /*
  console.log( { 
    "stack" : "AFTER getting all responses",
    "response" : response,
    e : e,
  });
  
  */
  
  response.getItemResponses().forEach( function (element) {
    responseObject[element.getItem().getTitle()] = element.getResponse();
  }, this);
  
  
  responseObject.email = response.getRespondentEmail(); 
  responseObject.url = response.getEditResponseUrl();
  
  
  processFormSubmit(responseObject); 
  
};




function sendMail( mail_array) {
  
  try {
    
    mail_array.forEach( function (message) {
      // message.to = 'zweisser@jmrl.org';
      console.log({"message" : message});
      MailApp.sendEmail(message);
    }, this);
    
  } catch (e) {
    console.log({ 
      "error" : e,
      "mail_array" : mail_array,
    });
    
  } finally {
    console.log({ 
      "Attempted to send mail": mail_array,
    });
  }
  
};



function processFormSubmit(responseObject) {
  
  console.log({ "responseObject": responseObject});
  
  var mail_array = [];

  //var emails = ['zweisser@jmrl.org'];
  
  var response = responseObject;
  
  var emails = ['zweisser@jmrl.org', 'mcohen@jmrl.org', 'jchasse@jmrl.org', 'jcarchedi@jmrl.org', 'jhoward@jmrl.org', response.email];

  /*
  Add an object to be mailed to the mail array
  
  */
  emails.forEach( function (email) {
    try {
      var mailObj = {
        to : email,
        subject : 'A new Employee Exit/Transfer Form has been submitted',
        htmlBody : '<a href="' + response.url + '">Can be found here</a>'
      };
    } catch (e) {
      
      var logobj = { 
        "Error in pushing mailobjects" : e,
        "mailObj" : mailObj,
      } ;
      console.log( logobj  );
      General.mailerror(logobj, "Error in trying to add mailobj for leave reportal request");
      
    } finally {
      if (mailObj) {
        mail_array.push(mailObj);
      }
    }
  }, this);
  
  
  /*
  send mail
  */
  sendMail (mail_array);
  
};



```
