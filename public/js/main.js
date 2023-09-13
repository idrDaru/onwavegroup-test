window.addEventListener("DOMContentLoaded", (e) => {
  $(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");
  });

  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://numbersapi.com/1/30/date?json", true);
  xhttp.onloadend = function () {
    const response = JSON.parse(this.responseText);
    const apiDiv = document.getElementById("api");
    const api2Div = document.getElementById("api2");
    apiDiv.style.opacity = 1;

    const apiTitle = document.createElement("h1");
    apiTitle.id = "api-title";
    apiTitle.className = "title api-information";
    apiTitle.innerHTML = "API";
    api2Div.appendChild(apiTitle);

    const apiText = document.createElement("p");
    apiText.id = "api-text";
    apiText.className = "api-information";
    apiText.innerHTML = response.text;
    api2Div.appendChild(apiText);

    const apiYear = document.createElement("p");
    apiYear.id = "api-text";
    apiYear.className = "api-information";
    apiYear.innerHTML = response.year;
    api2Div.appendChild(apiYear);

    const apiNumber = document.createElement("p");
    apiNumber.id = "api-text";
    apiNumber.className = "api-information";
    apiNumber.innerHTML = response.number;
    api2Div.appendChild(apiNumber);

    const apiFound = document.createElement("p");
    apiFound.id = "api-text";
    apiFound.className = "api-information";
    apiFound.innerHTML = response.found;
    api2Div.appendChild(apiFound);

    const apiType = document.createElement("p");
    apiType.id = "api-text";
    apiType.className = "api-information";
    apiType.innerHTML = response.type;
    api2Div.appendChild(apiType);

    apiDiv.style.height =
      apiTitle.offsetHeight +
      apiText.offsetHeight +
      apiYear.offsetHeight +
      apiNumber.offsetHeight +
      apiFound.offsetHeight +
      apiType.offsetHeight +
      20 +
      "px";
  };
  xhttp.send();

  var slice = 3;
  var groupedElement = [],
    ungroupedElement = [];
  var xhttp2 = new XMLHttpRequest();
  xhttp2.onload = function () {
    const responseImage = JSON.parse(this.responseText);
    for (let i = 0; i < responseImage.length; i += slice) {
      groupedElement.push(responseImage.slice(i, i + slice));
    }
    for (let i = 0; i < responseImage.length; i++) {
      ungroupedElement.push(responseImage);
    }
    draggableContainer(groupedElement);
  };
  xhttp2.open("GET", "http://localhost:3000/api/source_images", true);
  xhttp2.send();

  function centerImage(container, img) {
    img.style.top = container.clientHeight / 2 - img.height / 2 + "px";
    img.style.left = container.clientWidth / 2 - img.width / 2 + "px";
  }

  function imageLeftPosition(imageContainerWidth, index) {
    var sub3 = imageContainerWidth / 3;
    var sub2 = sub3 / 2;
    var left = sub3 * index - sub2 - 75;
    return left;
  }

  function imageTopPosition(index) {
    var top = 200 * index;
    return top;
  }

  function draggableContainer(groupedElement) {
    elements = groupedElement;

    const imageContainer = document.getElementById("image-container");
    groupedElement.forEach((columnElement, columnIndex) => {
      columnElement.forEach((rowElement, rowIndex) => {
        const newDiv = document.createElement("div");
        newDiv.id = `image-container-draggable-${columnIndex}${rowIndex}`;
        newDiv.style.left =
          imageLeftPosition(imageContainer.clientWidth, rowIndex + 1) + "px";
        newDiv.style.top = imageTopPosition(columnIndex + 1) + "px";
        newDiv.style.animation = `zoom-in-out ${getRandomNumberThreeDecimalPlaces()}s linear infinite`;

        const newImg = document.createElement("img");
        newImg.id = `image-draggable-${columnIndex}${rowIndex}`;
        newImg.src = rowElement;

        newDiv.appendChild(newImg);
        imageContainer.appendChild(newDiv);

        centerImage(newDiv, newImg);
        handleStyle(newDiv, newImg, rowIndex, columnIndex);
      });
    });

    imageContainer.style.height = groupedElement.length * 220 + "px";

    mainJs(groupedElement, imageContainer);
  }

  function getRandomNumberThreeDecimalPlaces() {
    const randomNumber = Math.random();
    const scaledNumber = randomNumber * (3 - 1) + 1;
    const roundedNumber = parseFloat(scaledNumber.toFixed(3));
    return roundedNumber;
  }

  function handleStyle(container, img, rowIndex, columnIndex) {
    const imageContainer = document.getElementById("image-container");
    container.style.left =
      imageLeftPosition(imageContainer.clientWidth, rowIndex + 1) + "px";
    container.style.top = imageTopPosition(columnIndex + 1) + "px";
    img.style.top = container.clientHeight / 2 - img.height / 2 + "px";
    img.style.left = container.clientWidth / 2 - img.width / 2 + "px";
  }

  function mainJs(data, imageContainer) {
    data.forEach((columnElement, columnIndex) => {
      columnElement.forEach((rowElement, rowIndex) => {
        const draggableContainerImage = document.getElementById(
          `image-container-draggable-${columnIndex}${rowIndex}`
        );

        dragElement(draggableContainerImage, imageContainer);
      });
    });
  }

  function dragElement(elmnt, imgContainer) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    if (elmnt) {
      elmnt.onmousedown = dragMouseDown;
    } else {
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();

      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
      elmnt.style.cursor = "grabbing";
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      var top = elmnt.offsetTop - pos2;
      var left = elmnt.offsetLeft - pos1;

      var parentWidth = imgContainer.clientWidth;
      var parentHeight = imgContainer.clientHeight;

      var elementWidth = elmnt.offsetWidth;
      var elementHeight = elmnt.offsetHeight;

      var maxLeft = parentWidth - elementWidth;
      var maxTop = parentHeight - elementHeight;

      if (top >= 0 && left >= 0 && left <= maxLeft && top <= maxTop) {
        elmnt.style.top = top + "px";
        elmnt.style.left = left + "px";
      }
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
      elmnt.style.cursor = "grab";
    }
  }

  window.addEventListener("resize", (e) => {
    elements.forEach((columnElement, columnIndex) => {
      columnElement.forEach((rowElement, rowIndex) => {
        const div = document.getElementById(
          `image-container-draggable-${columnIndex}${rowIndex}`
        );
        const img = document.getElementById(
          `image-draggable-${columnIndex}${rowIndex}`
        );

        handleStyle(div, img, rowIndex, columnIndex);
      });
    });
  });

  function isValidImageFile(files) {
    var isValid = false;
    for (let i = 0; i < files.length; i++) {
      if (files[i] && files[i].type.startsWith("image/")) {
        isValid = true;
      } else {
        isValid = false;
        return false;
      }
    }

    return isValid;
  }

  const fileInput = document.getElementById("image");
  const fileNameDisplay = document.getElementById("image-input-text");
  const fileInputLogoSvg = document.getElementById("image-input-logo-svg");
  const imgInputLabel = document.getElementById("image-input-label");

  function displayFileName(files) {
    if (imgInputLabel) {
      const removeP = imgInputLabel.getElementsByTagName("p");
      const removePArray = Array.from(removeP);
      removePArray.forEach((element) => {
        element.parentNode.removeChild(element);
      });
    }
    for (let i = 0; i < files.length; i++) {
      const imgInputText = document.createElement("p");
      imgInputText.id = `image-input-text-${i}`;
      imgInputText.style.fontSize = 20 + "px";
      imgInputText.innerHTML = `Image ${i + 1}: ` + files[i].name;
      imgInputLabel.appendChild(imgInputText);
    }
  }

  window.addEventListener("dragenter", (e) => {
    e.preventDefault();
    fileNameDisplay.style.fontSize = "25px";
    fileInputLogoSvg.style.animation = "spin 1s linear infinite";
  });

  window.addEventListener("dragover", (e) => {
    e.preventDefault();
    fileNameDisplay.style.fontSize = "25px";
    fileInputLogoSvg.style.animation = "spin 1s linear infinite";
  });

  window.addEventListener("dragleave", (e) => {
    e.preventDefault();
    fileNameDisplay.style.fontSize = "20px";
    fileInputLogoSvg.style.animation = "";
    fileInputLogoSvg.style.animationDelay = "2s";
  });

  window.addEventListener("drop", (e) => {
    e.preventDefault();
    if (imgInputLabel) {
      const removeP = imgInputLabel.getElementsByTagName("p");
      const removePArray = Array.from(removeP);
      removePArray.forEach((element) => {
        element.parentNode.removeChild(element);
      });
    }

    const emptyFile = new DataTransfer().files;
    fileInput.files = emptyFile;

    const files = e.dataTransfer.files;
    if (isValidImageFile(files)) {
      fileInput.files = files;
      displayFileName(files);
    } else {
      fileInputLogoSvg.style.animation = "";
      fileInputLogoSvg.style.transform = "rotate(45deg)";
      const wrongFileDisplayName = document.createElement("p");
      wrongFileDisplayName.id = "image-input-text";
      wrongFileDisplayName.innerText =
        "There is and invalid file type. Please drop an image file only.";
      imgInputLabel.appendChild(wrongFileDisplayName);
    }
  });

  fileInput.addEventListener("change", (e) => {
    const files = fileInput.files;
    displayFileName(files);
  });
});
