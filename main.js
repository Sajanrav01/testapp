$(document).ready(function(){
    new zapp.button({'pcid':32342});
    function myFunction() {
        alert("button clicked")
        document.getElementById("field2").value = document.getElementById("field1").value;
    }
});



