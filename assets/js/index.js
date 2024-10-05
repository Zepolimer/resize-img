const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');

const downloadResizedImg = document.getElementById('downloadResizedImg');

let originalImage = null;
let aspectRatio = 1;

dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => e.preventDefault());
dropZone.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);

downloadResizedImg.addEventListener('click', downloadResized);

function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImage(file);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        loadImage(file);
    }
}

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage = new Image();
        originalImage.onload = () => {
            aspectRatio = originalImage.width / originalImage.height;
            updateInputs(originalImage.width, originalImage.height);
            imagePreview.src = e.target.result;
            downloadResizedImg.disabled = false;
        };
        originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function updateInputs(width, height) {
    widthInput.value = (width / 37.795).toFixed(2);  // Convert pixels to cm
    heightInput.value = (height / 37.795).toFixed(2);

    widthInput.addEventListener('input', () => {
        heightInput.value = (widthInput.value / aspectRatio).toFixed(2);
    });

    heightInput.addEventListener('input', () => {
        widthInput.value = (heightInput.value * aspectRatio).toFixed(2);
    });
}

function resizeImage() {
    if (!originalImage) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const newWidth = widthInput.value * 37.795;  // Convert cm to pixels
    const newHeight = heightInput.value * 37.795;

    canvas.width = newWidth;
    canvas.height = newHeight;

    ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);
    return canvas.toDataURL();
}

function downloadImage(imageUrl) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'resized_image.png';
    link.click();
}

function downloadResized() {
    const resizedImageUrl = resizeImage();
    if (resizedImageUrl) {
        downloadImage(resizedImageUrl);
    }
}