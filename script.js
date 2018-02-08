
console.log("Hello from forms.js");



var form = new Form("important-form");
//var input = new Input("file");

var submit_button = document.getElementById("submit-button");
submit_button.addEventListener("click", function(event)
{
  
  event.preventDefault();    
    
  //Send the serialized form data to the backend.
  
  var form_data = form.serialize();   
     
  console.log(form_data);
    
    
    
  if (form.isValid() === true)
  {
    console.log("The form is valid!");
  }
  else
  {
    console.log("INVALID");
  }
    
  /*
    
  var posting = $.post("tests/submit/", form_data);
    
  posting.done(function(returned_data)
  {
    console.log(returned_data);
  })
    
  */
  
});