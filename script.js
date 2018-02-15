
console.log("Hello from forms.js");



var form = new Form("important-form");
//var input = new Input("file");

var submit_button = document.getElementById("submit-button");
submit_button.addEventListener("click", function(event)
{
  
  event.preventDefault();    
    
    
  //Testing how "file" inputs are being parsed for validity:
  var file = new Input("file");
  console.log(file.getUserFriendlyAcceptedFileExtensionsList());
    
    
    
  //Send the serialized form data to the backend.

    
    
    
  if (form.isValid() === true)
  {
    console.log("The form is valid!");
  }
  else
  {
    console.log("INVALID");
    
    
    var invalid_inputs = form.getInvalidInputs();  
      
    console.log("---- Invalid Inputs -----");  
    console.log(form.getInvalidInputs())
    
      
    for (var i = 0; i < invalid_inputs.length; i++)
    {
      console.log(invalid_inputs[i].getErrorMessage());
    }
  }
    
  /*
    
  var posting = $.post("tests/submit/", form_data);
    
  posting.done(function(returned_data)
  {
    console.log(returned_data);
  })
    
  */
  
});