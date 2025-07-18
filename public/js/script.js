(()=>{
    'use strict'

    //fetch all the forms we want to apply custom Bootstrap validations styles to
    const forms= document.querySelectorAll('.needs-validation')

    //loop over then and prevent submission
    Array.from(forms).forEach(form=>{
        form.addEventListener(
            "submit",
            event =>{
                if(!form.checkValidity())
                {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            },
            false)
    })
})()