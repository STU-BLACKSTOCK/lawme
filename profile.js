// Handle profile image upload
document.getElementById('profile-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-img').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Handle edit functionality
document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', function() {
        const detailItem = this.parentElement;
        const span = detailItem.querySelector('span');
        const currentText = span.innerText;

        // Create input field
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        span.style.display = 'none';
        detailItem.appendChild(input);
        input.focus();

        // Save changes on input blur or pressing Enter key
        input.addEventListener('blur', function() {
            span.innerText = input.value;
            span.style.display = 'inline';
            detailItem.removeChild(input);
        });

        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                input.blur();
            }
        });
    });
});
