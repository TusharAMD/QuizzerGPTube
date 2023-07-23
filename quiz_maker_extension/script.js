

function addButtonToYouTubePage() {
    function addCustomButton() {
        var shareButton = document.getElementById("top-level-buttons-computed");
        
        if (shareButton) {
        var myButton = document.createElement("div");
        myButton.id = "myExtensionButton";
        myButton.addEventListener("click", function () {
            console.log("Custom button clicked!");
            console.log(window.location.href)
            window.open(`http://127.0.0.1:5173/quiz?q=${window.location.href}`, "_blank");
        });

        var imgElement = document.createElement('img');
        imgElement.src = "https://i.ibb.co/8s1Mz4x/63427ca6-79fb-499f-b065-e2838774f323.jpg";
        imgElement.id = "iconimg"
        myButton.appendChild(imgElement)

        shareButton.parentNode.insertBefore(myButton, shareButton.nextSibling);
        observer.disconnect();
        }
    }

    var observer = new MutationObserver(function (mutationsList, observer) {
        for (var mutation of mutationsList) {
        if (mutation.type === "childList") {
            if (mutation.addedNodes.length > 0 && mutation.target.className === "style-scope ytd-menu-renderer") {
            addCustomButton();
            break;
            }
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });
}


addButtonToYouTubePage();
