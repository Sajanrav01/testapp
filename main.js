$(document).ready(function(){
    new zapp.button({'pcid':32342});
    function myFunction() {
        alert("clicked")
        document.getElementById("field2").value = document.getElementById("field1").value;
    }
});



