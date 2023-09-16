/**
 * Use to set currnet in admin menu
 */

document.addEventListener('DOMContentLoaded', function () {
    var li = document.querySelectorAll('#toplevel_page_simpleform-dashboard li a');

    // Function to update the 'current' class based on the current page URL
    function updateCurrentClass() {
        var currentPageURL = window.location.href;

        li.forEach(function (menuItem) {
            var menuItemURL = menuItem.getAttribute('href');
            if (currentPageURL.includes(menuItemURL)) {
                // Remove the 'current' class from all menu items
                document.querySelectorAll('#toplevel_page_simpleform-dashboard li').forEach(function (liItem) {
                    liItem.classList.remove('current');
                });
                // Add the 'current' class to the parent of the menu item that matches the current URL
                menuItem.parentElement.classList.add('current');
            }
        });
    }

    // Initially, set the 'current' class based on the current page URL
    updateCurrentClass();

    // Add click event handlers to update the 'current' class on menu item clicks
    li.forEach(function (menuItem) {
        menuItem.addEventListener('click', function () {
            // Remove the 'current' class from all menu items except the clicked one
            document.querySelectorAll('#toplevel_page_simpleform-dashboard li').forEach(function (liItem) {
                if (liItem !== menuItem.parentElement) {
                    liItem.classList.remove('current');
                }
            });
            // Add the 'current' class to the parent of the clicked menu item
            menuItem.parentElement.classList.add('current');
        });
    });

    // Check if no menu item has the 'current' class and set it on the first menu item with the class 'wp-first-item'
    var currentMenuItem = document.querySelector('#toplevel_page_simpleform-dashboard li.current');
    if (!currentMenuItem) {
        var firstMenuItem = document.querySelector('#toplevel_page_simpleform-dashboard li.wp-first-item');
        if (firstMenuItem) {
            firstMenuItem.classList.add('current');
        }
    }
});