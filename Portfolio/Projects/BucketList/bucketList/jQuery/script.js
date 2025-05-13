$(document).ready(function(){

    $("ul").on("click", "li", function() {
        $(this).toggleClass("completed")
    })
    $("ul").on("click", "span", function() {
        $(this).parent().remove()
    })

    $("input").keypress(function(event) {
        if(event.which === 13) {      //if user presses 13(enter)
            var listItem = $(this).val()                            //grab value of input
            $("ul").append(`<li>${listItem} <span><i class="fa-solid fa-trash"></i></span></li>`)
            $(this).val("")
        }
        
    })
//if want challenge
//button, only 30 characters, both button and enter works


})