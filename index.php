<!DOCTYPE html>
<html>
   <head></head>
    <body>
        <form id = "important-form" name = "important-form" enctype = "application/x-www-form-urlencoded">
          <input type = "text" id = "address" name = "address" required = true placeholder = "address"/>
            <br>
          <input type = "text" id = "phone" name = "phone" required = "true" placeholder = "phone"/>
            <br>
          Yes<input type = "checkbox" id = "opt-in-checkbox-yes" name = "opt-in-checkbox" required = "true" />
            <br>
          No<input type = "checkbox" id = "opt-in-checkbox-no" name = "opt-in-checkbox" required = "true" />
            <br>
          FM<input type = "radio" id = "opt-in-radio-fm" name = "opt-in-radio"  value = "fm" required = "true" />
            <br>
          AM<input type = "radio" id = "opt-in-radio-am" name = "opt-in-radio" value = "am" required = "true" />
            <br>
          <input type = "file" id = "file" name = "file" required = "true" data-accepted-file-extensions = ".txt, .html, .pdf" data-max-file-size = "" multiple/>
            <br>
          <textarea id = "description" name = "description" required = "true" maxlength = "50" placeholder = "description"></textarea>
            <br>
          <select id = "state" name = "state" required = "true">
            <option id = "nevada" value = "nevada">Nevada</option>
            <option id = "oregon" value = "oregon">Oregon</option>
            <option id = "washington" value = "washington">Washington</option>
          </select>
            <br>
          <button id = "submit-button" name = "submit-button">Submit</button>
            <br>
        </form>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src = "forms.0.2.js"></script>
        <script src = "script.js"></script>
    </body>
</html>