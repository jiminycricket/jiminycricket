$(document).ready(function(){
  var arrayOfImages;
  console.log("hahahahaha");
  arrayOfImages = ['../../images/1.jpg', '../../images/2.jpg', '../../images/3.jpg', '../../images/4.jpg', '../../images/5.jpg', '../../images/6.jpg', '../../images/7.jpg', '../../images/8.jpg', '../../images/9.jpg'];
  console.log(arrayOfImages);
  return $('#doll').rollerblade({
    imageArray: arrayOfImages,
    sensitivity: 50,
    drag: false
  });
});