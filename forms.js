var Input = function(input_element_id)
{
    
  //Core properties
  this.element = document.getElementById(input_element_id);
  this.type = this.element.getAttribute("type");
  this.name = this.element.getAttribute("name");
  this.id = this.element.getAttribute("id");
  this.hash_id = '#'+this.id;    
  this.tagname = this.element.tagName;
    
  

  //Non-traditional properties
  this.accepted_file_extensions = this.element.getAttribute("data-accepted-file-extensions");
    
  //Error messages  
  this.error_message = "";    
  this.user_friendly_error_message = "";
    
    
  //Methods    
  this.getAsDOMElement = function getAsDOMElement()
  {
    return this.element;
  }
  
  this.getType = function getType()
  {
    return this.type;
  }
  
  this.getId = function getId()
  {
    return this.id;
  }
  
  this.getHashId = function getHashId()
  {
    return this.hash_id;
  }
  
  this.getTagName = function getTagName()
  {
    return this.tagname;
  }
  
  this.getName = function getName()
  {
    return this.name;
  }
  
  //Note:  The value of the object is not stored as a permanent property
  this.getValue = function getValue()
  {
    return this.element.value;
  }
  
  
  
  this.setErrorMessage = function setErrorMessage(message_string)
  {
    this.error_message = message_string;
  }
  
  
  this.getErrorMessage = function getErrorMessage()
  {
    return this.error_message;
  }

    
  this.setUserFriendlyErrorMessage = function setUserFriendlyErrorMessage(message_string)
  {
    this.user_friendly_error_message = message_string;
  }
  
  this.getUserFriendlyErrorMessage = function getUserFriendlyErrorMessage()
  {
    return this.user_friendly_error_message;
  }
  
  //Returns the FileList for a given file <input>
  this.getFiles = function getFiles()
  {
    return this.element.files; //If no file chosen, returns FileList of length 0 for "file" <input> types; null for non-file <input> types. Works with both "multiple" and singular file <inputs>
  }
  
    

  this.isRequired = function isRequired()
  {
    var required = false; 
      
    //Special handling is required for checkboxes and radios, as they are individual elements that can be bound together as a group via the "name" attribute. If one of the checkboxes or radios in the group is required, then the entire set of checkboxes or radios is shares that hard requirement.
    if (this.getTagName() === "input" && (this.getType() === "checkbox" || this.getType() === "radio"))
    {
      //First, check to see if this checkbox or radio is a part of a group.
      if (this.isCheckboxGroup() === true)
      {
        //If it is a part of a checkbox group, we any member of this checkbox group is required. If it is, then the entire group is required.
        var checkbox_group_elements = document.getElementsByName(this.getName());
          
        for (var i = 0; i < checkbox_group_elements.length; i++)
        {
          if (checkbox_group_elements[i].hasAttribute("required"))
          {
            required = true;
          }
        }
      }
      else
      {
        if (this.element.hasAttribute("required"))
        {
       
          required = true;
           
          //If the attribute exists, but is set to a false value -- via boolean or via string -- ensure we return a false value.
          if (this.element.getAttribute("required") === "false" || this.element.getAttribute("required") === false)
          {
            required = false;    
          }  
        }
        else
        {
          required = false;
        }
      }
    }
    else
    {
      //If the dev has simply put the word "required" and hasn't assigned a value to the attribute, that's enough for us, as that will -- by default html5 -- trigger the warning.
      if (this.element.hasAttribute("required"))
      {
       
        required = true;
           
        //If the attribute exists, but is set to a false value -- via boolean or via string -- ensure we return a false value.
        if (this.element.getAttribute("required") === "false" || this.element.getAttribute("required") === false)
        {
          required = false;    
        }  
      }
      else
      {
        required = false;
      }
    }
    
    return required;
      
  }
  
  
  
  //Strips all leading "." (dots) and reassembles an array of strings that dictate the file extensions accepted by this input.
  function standardizeAcceptedFileExtensionsArray(extensions_array)
  {
      
    //First, ensure that we strip out all leading "." in case the dev lists the extensions with preceeding dots. (i.e.: .txt, .xlsx, .ppt)
    var standardized_array = [];
    for (var i = 0; i < extensions_array.length; i++)
    {
      var extensions_array_element = extensions_array[i].toString().trim().toLowerCase();    
        
      if (extensions_array_element.charAt(0) === ".")
      {
        var extension_pieces = extensions_array_element.split(".");
        standardized_array.push(extension_pieces[extension_pieces.length - 1]);
      }
      else
      {
        standardized_array.push(extensions_array[i].toString().trim().toLowerCase());
      }
    }  
      
    return standardized_array;
  }
  
  

    
    
  //Returns an array of strings; each one being the extension of a currently ready-to-be-uploaded singular file. Works for both singular and multiple file upload <input>s
  //Note: Need to handle for multiple upload input type.
  this.getStandardizedFileExtensionsFromAttachedFiles = function getStandardizedFileExtensionsFromAttachedFiles()
  {
      
    var file_extensions = [];  
    var files = this.getFiles();
    
    for (var i = 0; i < files.length; i++)
    {
      var file_name = files[i].name.toString().trim().toLowerCase();
      var file_name_pieces = file_name.split(".");
      
      file_extensions.push(file_name_pieces[file_name_pieces.length - 1]);
      
    }
      
    return standardizeAcceptedFileExtensionsArray(file_extensions);
  }
    
  
  this.setAcceptedFileExtensions = function setAcceptedFileExtensions(extensions_array)
  {  
    this.accepted_file_extensions = standardizeAcceptedFileExtensionsArray(extensions_array);
  }
  
  this.getAcceptedFileExtensions = function getAcceptedFileExtensions()
  {
    return this.accepted_file_extensions;
  }
  
  this.isAcceptedFileExtension = function isAcceptedFileExtension(extension_string)
  {
      
    var is_accepted = false;
      
    //First, check to see if we have any accepted extensions at all
    var accepted_file_extensions = this.getAcceptedFileExtensionsFromDataAttribute();
      
    if (accepted_file_extensions !== null && accepted_file_extensions.length > 0)
    {
      //Next, standardize the given file extension.
      var extension_string = extension_string.toString().trim().toLowerCase();
      
      if (extension_string.charAt(0) === '.')
      {
        var extension_string_pieces = extension_string.split(".");
        extension_string = extension_string_pieces[extension_string_pieces.length - 1];
      }
    

    
      
      //Cycle through our accepted extensions and see if we have a match.
      for (var i = 0; i < accepted_file_extensions.length; i++)
      {

          
        if (extension_string.toString() === accepted_file_extensions[i].toString().trim().toLowerCase())
        {

          is_accepted = true;
            
          
          //For our use later on, we need to break early here and immediately return the "true" value.
          /*
           For instance, in the case of our accepted extensions being [txt, pdf, html], if we upload an [html] file, it will flag as false for not matching with [txt] or [pdf]         
          */
          break;    
            
        }
      }     
    }
    //If we don't declare desired file types, anything goes, and therefore all file extensions are accepted.
    else
    {
      is_accepted = true;
    }
      

    return is_accepted;
      
  }
  
  
  //Retrieves the accepted file extensions from the data attribute and returns it as an array.
  this.getAcceptedFileExtensionsFromDataAttribute = function getAcceptedFileExtensionsFromDataAttribute()
  {
    var accepted_extensions_data_attribute_value = this.element.getAttribute("data-accepted-file-extensions").toString().trim().toLowerCase();
    
    return standardizeAcceptedFileExtensionsArray(accepted_extensions_data_attribute_value.split(","));
  }
  
  
  this.getUserFriendlyAcceptedFileExtensionsList = function getUserFriendlyAcceptedFileExtensionsList()
  {
      
    var extensions_list_string = "";  
      
    var accepted_extensions = this.getAcceptedFileExtensionsFromDataAttribute();  
      
    for (var i = 0; i < accepted_extensions.length; i++)
    {
      if (extensions_list_string === "")
      {
        extensions_list_string = extensions_list_string + accepted_extensions[i].toUpperCase();
      }
      else
      {
        extensions_list_string = extensions_list_string + ", " + accepted_extensions[i].toUpperCase();
      }
    }
      
    return extensions_list_string;  
  }
  
  
  
  //Checks a singular checkbox or radio <input> to see whether or not it is checked.
  this.isChecked = function isChecked()
  {
    var is_checked = false;
      
    var element = this.getAsDOMElement();
      
    if (element.checked)
    {
      is_checked = true;    
    }
      
    return is_checked;
  }
  
  
  this.isCheckboxGroup = function isCheckboxGroup()
  {
    var is_checkbox_group = false;
      
    //We'll use this checkbox's "name" attribute to see if there's any other checkboxes, other than this one, sharing this name. That will tell us if they're part of a group.
    var checkbox_element_name = this.getName();
    
    var similar_elements = document.getElementsByName(checkbox_element_name);
      
    if (similar_elements.length > 1)
    {
      is_checkbox_group = true;
    }
    
    return is_checkbox_group;
      
  }
  
  
  
  
  /*
  
  Input validity is defined as follows:
  
  [Email]
    Required: Email must have a length greater than 0 and contain both a "." and an "@".
    Not required: Should the email Input contain any form of entry, it must contain both a "." and an "@".
    
  [Text]
    Required: It must have a length > 0.
    Not-required: It may contain any form of entry, thus not making it beholden to any type of specific requirement.
    
  [File] (All file entries must have a specified series of accepted file extensions; if not, an error is thrown.)
    Required: The file(s) attached must match one of the accepted file extensions listed in the "data-accepted-file-extensions" attribute.
    Not-required: The file(s) attached must match one of the accepted file extensions listed in the "data-accepted-file-extensions" attribute.
    
  [TextArea]
    Required: The text area must have content that's greater than a length of 0.
    Not-required: It may contain any form of entry, thus not making it beholden to any type of specific requirement.
    
  [Select]
    Required: There must be a non-default option selected that contains a value with length > 0
    Not-required: It may have the default option that may contain a value with a length of 0.
    
  [Checkbox]
    Required: 
      Groups: For checkbox groups -- groups of checkboxes that have the same "name" attribute -- one OR more options must be selected by way of a checkmark 
      Singular: For singular, the checkbox must be checked
    Not-required: 
      Groups: No value or checked validation is needed
      Singular: No value or checked validation is needed
  
  [Radio]
    Required: 
      Groups: For checkbox groups -- groups of checkboxes that have the same "name" attribute -- one OR more options must be selected by way of a checkmark 
      Singular: For singular, the checkbox must be checked
    Not-required: 
      Groups: No value or checked validation is needed
      Singular: No value or checked validation is needed
  
  */
  //Note: [11-11-2018]: Fatal error in logic. For SELECT tags, if no element is selected, it fails to fetch the .value of "undefined". We need to test to see if the element exists.
  this.isValid = function isValid()
  {
    
    var valid = false;
    
      
    //We can store tagname into a variable and use it reliably, as all HTML tags have a tagname. The "type" attribute, however, might not be inherit to every tag, so it's best to look that up as needed depending upon the tagname.
    var tagname = this.getTagName().toString().trim().toLowerCase();
      
      
    if (tagname === "textarea")
    {
      if (this.isRequired() === true)
      {
        if (this.getValue() !== "" && this.getValue().toString().trim().length > 0)
        {
          valid = true;
        }
        else
        {
          valid = false;
          this.setErrorMessage("No value provided for textarea element of ID: `" + this.getId()+"`");
          this.setUserFriendlyErrorMessage("Please complete this field.");
        }
      }
      else
      {
        valid = true;
      }
    }

      
    if (tagname === "select")
    {
      if (this.isRequired() === true)
      {
        var select_element = this.getAsDOMElement();
          
        if (typeof(select_element[select_element.selectedIndex]) !== undefined && typeof(select_element[select_element.selectedIndex]) !== "undefined")
        {
          var select_element_value = select_element[select_element.selectedIndex].value;    
            
          if(select_element_value.toString().trim().length > 0)
          {
            valid = true;
          }
          else
          {
            valid = false;
            this.setErrorMessage("No value value provided for select element of ID: `" + this.getId()+"`");
            this.setUserFriendlyErrorMessage("Please select an option.");
          }
        }
        else
        {
          valid = false;
          this.setErrorMessage("No valid value provided for select element of ID: `" + this.getId()+"`");
          this.setUserFriendlyErrorMessage("Please select an option.");
        }
      }
      else
      {
        valid = true;
      }
    }
      
      
    if (tagname === "input" && this.getType() === "text")
    {
      if (this.isRequired() === true)
      {
        if (this.getValue())
        {
          valid = true;
        }
        else
        {
          valid = false;
          this.setErrorMessage("No value provided for input element of ID: `" + this.getId()+ "`");
          this.setUserFriendlyErrorMessage("Please complete this field.");
        }
      }
      else
      {
        valid = true;
      }
    }
      
      
      
    if (tagname === "input" && this.getType() === "url")
    {
      if (this.isRequired() === true)
      {
        //A user-submitted url, at a minimum, must contain at least a "." for .com, .net, etc.
        if (this.getValue() && this.getValue().toString().trim().toLowerCase().indexOf(".") !== -1)
        {
          valid = true;
        }
        else
        {
          valid = false;
          this.setErrorMessage("Missing or incorrect format for value provided for input element of ID: `" + this.getId()+ "`");
          this.setUserFriendlyErrorMessage("Please provide a valid url.");
        }
      }
      else
      {
        valid = true;
      }  
    } 
      
      
    if (tagname === "input" && this.getType() === "number")
    {
  
        
      if (this.isRequired() === true)
      {
        //A user-submitted url, at a minimum, must contain at least a "." for .com, .net, etc.
        if (this.getValue() && (isNaN(this.getValue()) === false))
        {
          valid = true;
        }
        else
        {
          valid = false;
          this.setErrorMessage("Missing or incorrect format for value provided for input element of ID: `" + this.getId()+ "`");
          this.setUserFriendlyErrorMessage("Please provide a valid number.");
        }
      }
      else
      {
        valid = true;
      }  
    }
      
      
      
    if (tagname === "input" && this.getType() === "date")
    {
      if (this.isRequired() === true)
      {
        if (this.getValue())
        {
          valid = true;
        }
        else
        {
          valid = false;
          this.setErrorMessage("No value provided for input element of ID: `" + this.getId()+ "`");
          this.setUserFriendlyErrorMessage("Please enter a valid date.");
        }
      }
      else
      {
        valid = true;
      }  
    }  
      
      
      
      
    if (tagname === "input" && this.getType() === "tel")
    {
      if (this.isRequired() === true)
      {
        if (this.getValue())
        {
          valid = true;
        }
        else
        {
          valid = false;
          this.setErrorMessage("No value provided for input element of ID: `" + this.getId()+ "`");
          this.setUserFriendlyErrorMessage("Please complete this field.");
        }
      }
      else
      {
        valid = true;
      }  
    }
      
      
      
    if (tagname === "input" && this.getType() === "email")
    {
      if (this.isRequired() === true)
      {
        if (this.getValue())
        {
          if (this.getValue().indexOf("@") !== -1 && this.getValue().indexOf(".") !== -1)
          {
            valid = true;
          }
          else
          {
            valid = false;
            this.setErrorMessage("Incorrect email address format for input element of ID: : `" + this.getId() + "`");
            this.setUserFriendlyErrorMessage("Please ensure your email address was entered correctly.");
          }
        }
        else
        {
          valid = false;
          this.setErrorMessage("No value provided for input element of ID: `" + this.getId() + "`");
          this.setUserFriendlyErrorMessage("Please complete this field with a valid email address.");
        }
      }
      else
      {
        if (this.getValue())
        {
          if (this.getValue().indexOf("@") !== -1 && this.getValue().indexOf(".") !== -1)
          {
            valid = true;
          }
          else
          {
            valid = false;
            this.setErrorMessage("No value provided for input element of ID: `" + this.getId()+ "`");
            this.setUserFriendlyErrorMessage("Please complete this field with a valid email address.");
          }
        }
        else
        {
          valid = true;
        }
      }
    }
      
      
      
   if (tagname === "input" && this.getType() === "password")
    {
      if (this.isRequired() === true)
      {
        if (this.getValue())
        {
          valid = true;
        }
        else
        {
          valid = false;
          this.setErrorMessage("No value provided for input element of ID: `" + this.getId()+ "`");
          this.setUserFriendlyErrorMessage("Please complete this field.");
        }
      }
      else
      {
        valid = true;
      }  
    }
      
      
      
    if (tagname === "input" && this.getType() === "file")
    {  
        
      //With validity as being assumed false, and how we've set up isAcceptedFileExtension to balk on the first encounter with an invalid (false) extension, we need to flip the script a bit here and begin our calculations by first assuming that a file's validity is true.    
      var file_is_valid = true;    
        
      if (this.isRequired() === true)
      {
         if (this.getFiles().length > 0)
         {
           //Retrieve our desired file extensions, if any
           var accepted_extensions = this.getAcceptedFileExtensionsFromDataAttribute();

           if (accepted_extensions !== null && accepted_extensions.length > 0)
           {
             //Harvest the file extension from each of the given files.
             var attached_file_extensions = this.getStandardizedFileExtensionsFromAttachedFiles();

               
             for (var i = 0; i < attached_file_extensions.length; i++)
             {
               var is_accepted_extension = this.isAcceptedFileExtension(attached_file_extensions[i]);     
                 
               if (is_accepted_extension === false)
               {
                 file_is_valid = false; 
                 this.setErrorMessage("Incorrect file extension for file input of ID: `" + this.getId()+ "`");
                 this.setUserFriendlyErrorMessage("Please only submit documents of the following types: " + this.getUserFriendlyAcceptedFileExtensionsList());
                   
                 //Breaking here allows us to stop parsing the rest of the files, as just one being invalid invalidates the entire Input.
                 break;
               }
             }
           }
           //If it's required, but we don't have any pre-set accepted file extensions, yet the user did attach files, then anything goes and it's valid.
           else
           {
             file_is_valid = true; 
           }
         }
         //If it's required, but there's no files attached, then it's not valid.
         else
         {
           file_is_valid = false; 
           this.setErrorMessage("No files attached for file input of ID: `" + this.getId() + "`");
           this.setUserFriendlyErrorMessage("Please attach and upload the requested files.");
         }
      }
      //If the file field is not required ...
      else
      {
        if (this.getFiles().length > 0)
        {
           //Retrieve our desired file extensions, if any
           var accepted_extensions = this.getAcceptedFileExtensionsFromDataAttribute();

           if (accepted_extensions !== null && accepted_extensions.length > 0)
           {
             //Harvest the file extension from each of the given files.
             var attached_file_extensions = this.getStandardizedFileExtensionsFromAttachedFiles();

               
             for (var i = 0; i < attached_file_extensions.length; i++)
             {
               var is_accepted_extension = this.isAcceptedFileExtension(attached_file_extensions[i]);     
                 
               if (is_accepted_extension === false)
               {
                 file_is_valid = false; 
                 this.setErrorMessage("Incorrect file extension for file input of ID: `" + this.getId()+ "`");
                 this.setUserFriendlyErrorMessage("Please only submit documents of the following types: " + this.getUserFriendlyAcceptedFileExtensionsList());
                   
                 //Breaking here allows us to stop parsing the rest of the files, as just one being invalid invalidates the entire Input.
                 break;
               }
             }
           }
           //If it's required, but we don't have any pre-set accepted file extensions, yet the user did attach files, then anything goes and it's valid.
           else
           {
             file_is_valid = true; 
           }
        }
        else
        {
          file_is_valid = true; //It's valid if we don't require files and there's none attached.
        }
      }
        
      if (file_is_valid === true)
      {
        valid = true;
      }
      else
      {
        valid = false;
      }
        
        
      return valid;
    }
      
      
    if (tagname === "input" && (this.getType() === "checkbox" || this.getType() === "radio"))
    {
      if (this.isRequired() === true)
      {
        if (this.isCheckboxGroup() === true)
        {

          //Get each of the checkboxes with this name, if even a single one is checked -- given it's a group -- it's valid.
          var group_elements = document.getElementsByName(this.getName());
            
          var singular_checkbox_from_checkbox_group_is_checked = false; 
            
          for (var i = 0; i < group_elements.length; i++)
          {
            if (group_elements[i].checked)
            {

              singular_checkbox_from_checkbox_group_is_checked = true;
            }
            else if (i >= group_elements.length && singular_checkbox_from_checkbox_group_is_checked === false)
            {
              singular_checkbox_from_checkbox_group_is_checked = false; 
            }
          }
            
          if (singular_checkbox_from_checkbox_group_is_checked === true)
          {
            valid = true;
          }
          else
          {
            valid = false;
            this.setErrorMessage("No value chosen chosen for checkbox/radio group of name: `" + this.getName() + "` and ID of: `" + this.getId() + "`");
            this.setUserFriendlyErrorMessage("Please complete this selection.");  
          }
            
        }
        else
        {   
          if (this.isChecked() === true)
          {
            valid = true;   
          }
          else
          {
            valid = false; 
            this.setErrorMessage("No value chosen chosen for checkbox/radio element of ID: `" + this.getId()+ "`");
            this.setUserFriendlyErrorMessage("Please complete this selection.");       
          }
        }
      }
      else
      {
        valid = true;
      }
    }
      
   
  return valid;    
    
  }//end: isValid() method
  
  
  
  /*
  this.serialize = function serialize()
  {
      
    var serialize = true;  
      
    var serialized_string = "";  
      
    var tagname = this.getTagName();
        
    //Like jQuery, we only want to serialize checkboxes and radio inputs that have a name. 
    if (this.element.hasAttribute("name") === true)
    {
      //For checkboxes and radios, we only serialize those that have been checked
      if (tagname === "input" && this.getType() === "checkbox" || this.getType() === "radio")
      {
        if (this.isChecked() === false)
        {
          serialize = false;
        }
      }
        
      //We do not serialize files.
      if (this.getType() === "file")
      {
        serialize = false;
      }
    }
    else
    {
      serialize = false;
    }
        
     
    if (serialize === true)
    {
      serialized_string = encodeURIComponent(this.getName())+"="+encodeURIComponent(this.getValue());  
    }
      
    
    return serialized_string;
      
  }
  */
}//end: Input class



var Form = function(form_element_id)
{
   
  this.element = document.getElementById(form_element_id);
    
  this.id = this.element.getAttribute("id");
  this.name = this.element.getAttribute("name");
    
  this.enctype = this.element.getAttribute("enctype");
  this.charset = this.element.getAttribute("accept-charset");
    
  this.hash_id = "#"+this.id;    
  
  //Note: This property allows us to dictate which, if any, input element IDs should be ignored and not parsed as Input element by id. These will be passed in via Javascript to avoid as much front-end visbility as possible that might reveal any level of backend logic to the enduser.
  this.excluded_input_elements = null;

  this.getAsDOMElement = function getAsDOMElement()
  {
    return this.element;  
  };
    
  this.getId = function getId()
  {
    return this.id;
  }
  
  this.getName = function getName()
  {
    return this.name;
  }
    
  
  this.getHashId = function getHashId()
  {
    return this.hash_id;
  }
    
  this.getEnctype = function getEnctype()
  {
    return this.enctype;
  }
  
  
  this.getCharset = function getCharset()
  {
    return this.charset;
  }
  
  this.setExcludedInputElements = function setExcludedInputElements(excluded_element_ids_array)
  {
    this.excluded_input_elements = excluded_element_ids_array;      
  }
  
  this.getExcludedInputElements = function getExcludedInputElements()
  {
    return this.excluded_input_elements;  
  }
  
  //Note: [11-08-2018] Added special handling for the detection of Google reCaptcha bot checkboxes
  this.hasGoogleRecaptcha = function hasGoogleRecaptcha()
  {
    var has_google_recaptcha = false;
      
    if (this.getAsDOMElement().getElementsByClassName("g-recaptcha").length > 0)
    {
      has_google_recaptcha = true;
    }
      
    return has_google_recaptcha;
  }
  
  this.getGoogleRecaptchaValue = function getGoogleRecaptchaValue()
  {
    return this.getAsDOMElement().getElementsByClassName("g-recaptcha")[0].children[0].children[1].value;  
  }
  
  
  //Returns all <input> <textarea> and <select> items as an array of default HTMLCollections
  /*
  this.getAllFieldsAsHTMLCollection = function getAllFieldsAsHTMLCollection()
  {
    var html_collection = [];
      
    var input_html_collection = this.element.getElementsByTagName("input");
    var textarea_html_collection = this.element.getElementsByTagName("textarea");
    var select_html_collection = this.element.getElementsByTagName("select");
    
    for (var i = 0; i < input_html_collection.length; i++)
    {
      html_collection.push(input_html_collection[i]);
    }
      
  }
  */
  
  
  //Returns all of this form's <input> elements as an array.
  //Note: [2-6-2018] - We need to gather TextAreas as well!
  this.getFieldsAsInputElements = function getFieldsAsInputElements()
  {
    //First, let's get all of the <input> elements in this Form.
    var input_elements_htmlcollection = this.element.getElementsByTagName("input");
    var textarea_elements_htmlcollection = this.element.getElementsByTagName("textarea");
    var select_elements_htmlcollection = this.element.getElementsByTagName("select");  
      
      
    //Next, put all of the elements into one, uniform array.
    var html_collection = [];
      
    //Put all of the <inputs> into our html_collection array.
    for (var i = 0; i < input_elements_htmlcollection.length; i++)
    {
      html_collection.push(input_elements_htmlcollection[i]);
    }
      
    //Put all of the <textareas> into our html_collection array.
    for (var j = 0; j < textarea_elements_htmlcollection.length; j++)
    {
      html_collection.push(textarea_elements_htmlcollection[j]);
    }
      
      
    //Put all of the <select> into our html_collection array.
    for (var k = 0; k < select_elements_htmlcollection.length; k++)
    {
      html_collection.push(select_elements_htmlcollection[k]);
    }
      
      
  
      
    //Next, let's get our excluded elements (if there are any).
    var excluded_input_element_ids = this.getExcludedInputElements();
      
      
    //IE 11 is wonky with how you can and cannot place HTMLCollections and NodeLists into arrays, so we're just going to loop.
    var input_elements = [];
      
    for (var l = 0; l < html_collection.length; l++)
    {
        
      var include_element = true; //this boolean helps us determine which elements will be included in the final input_elements array, as we need to sort those which are and aren't excluded.
      var input_element_id = html_collection[l].getAttribute("id").trim().toLowerCase();
        
      //If this form has elements that we wanted to exclude, make sure that we don't scoop these up as Input elements
      if (excluded_input_element_ids !== null && excluded_input_element_ids.length > 0)
      {
        for (var m = 0; m < excluded_input_element_ids.length; m++)
        {
          if (excluded_input_element_ids[m].toString().trim().toLowerCase() === input_element_id)
          {
            include_element = false;
          }
        }
      }
        
      if (include_element === true)
      {
        input_elements.push(new Input(html_collection[l].getAttribute("id")));    
      }
    }
      
    return input_elements;
  }

  
  //Returns a boolean indicating whether or not this form contains an <input> element of type "file"
  this.hasFileInput = function hasFileInput()
  {
    var has_file_input = false;
    var input_html_collection = this.element.getElementsByTagName("input");
    
    //Loop through our <input> elements to see if any are of type "file."
    for (var i = 0; i < input_html_collection.length; i++)
    {
      if (input_html_collection[i].getAttribute("type").toString().trim().toLowerCase() === "file")
      {
        has_file_input = true;  
      }
    }
      
    return has_file_input;
  }
  
  /*
  this.serialize = function serialize()
  {
    
    var serialized_string = '';
      
    //Note: This only harvests the elements we have left unexcluded.
    var input_elements = this.getFieldsAsInputElements();

    
    for (var i = 0; i < input_elements.length; i++)
    {   
      if (serialized_string === '')
      {
        serialized_string = serialized_string + input_elements[i].serialize();
      }
      else
      {
        serialized_string = serialized_string + '&' + input_elements[i].serialize();
      }
    }
      
    return serialized_string;
  }
  */  
  
  
  //Returns the suggested Content-Type for this form
  this.getSuggestedMIMEType = function getSuggestedMIMEType()
  {
      
    var suggested_mime_type = '';  
      
      
    //First, check to see if this form has an established ContentType by way of the "enctype" attribute
    if (this.getEnctype())
    {
      suggested_mime_type = this.getEnctype();
    }
    else
    {
      var has_form = this.hasFileInput();
      
      if (has_form === true)
      {
        suggested_mime_type = 'multipart/form-data';
      }
        
      if (has_form === false)
      {
        suggested_mime_type = 'application/x-www-form-urlencoded';
      }   
    }
      
    return suggested_mime_type;
      
  }
  
  /*
  this.getSuggestedCharset = function getSuggestedCharset()
  {
      
    var suggested_charset = '';  
      
    if (this.getCharset())
    {
      //Note: Mind the use of uppercase here to properly conform to the casing in the request header.
      suggested_charset = this.getCharset().toString().trim().toUpperCase();
    }
    else
    {
      suggested_charset = 'UTF-8';
    }
      
    return suggested_charset;
      
  }
  */
  
  this.getSuggestedRequestHeaderName = function getSuggestedRequestHeaderName()
  {
    return 'Content-Type';
  }
  
  this.getSuggestedRequestHeaderBody = function getSuggestedRequestHeaderBody()
  {
    return this.getSuggestedMIMEType();  
  }
  
  
  this.isValid = function isValid()
  {
      
    var valid = true;
      
      
    //Note: [11-08-2018] Shortcircuit event | If the form has a Google recaptcha element, ensure it has a value.
    if (this.hasGoogleRecaptcha() === true)
    {
      var google_recaptcha_value = this.getGoogleRecaptchaValue();
        
      if (google_recaptcha_value.length === 0 || google_recaptcha_value === "undefined" || google_recaptcha_value === undefined)
      {
        valid = false;
        return valid;
      }
    }
      
      
    var inputs = this.getFieldsAsInputElements();
      
    for (var i = 0; i < inputs.length; i++)
    {
      if (inputs[i].isValid() === false)
      {
        valid = false;
      }
    }

    return valid;      
  }
  
  //Returns an array of all invalid Input objects
  this.getInvalidInputs = function getInvalidInputs()
  {
    var invalid_inputs = [];        
    var inputs = this.getFieldsAsInputElements();

    for (var i = 0; i < inputs.length; i++)
    {
      if (inputs[i].isValid() === false)
      {
        invalid_inputs.push(inputs[i]);  
      }
    }
      
    return invalid_inputs;
  }
  
}//end: Form class