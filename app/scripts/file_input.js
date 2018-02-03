
// var aa = window.TestParameter
// console.log(aa)
  //序号
$(function() {
   $(".controls button").on("click", function(e) {
    var input = document.querySelector(".controls input[type=file]");
    if (input.files && input.files.length) {
      Quagga.decodeSingle({
        inputStream: {
          size: 800 // 这里指定图片的大小，需要自己测试一下
        },
        locator: {
          patchSize: "medium",
          halfSample: false
        },
        numOfWorkers: 1,
        decoder: {
          readers: [{
            format: "ean_reader",// 这里指定ean条形码，就是国际13位的条形码
            config: {}
          }]
        },
        locate: true,
        src: URL.createObjectURL(input.files[0])
      }, function(result) {
         var code = result.codeResult.code,
          $node,
          canvas = Quagga.canvas.dom.image;
        // 将扫描得到的条形码打印出来
        // $node = $('<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>');
        // $node.find("img").attr("src", canvas.toDataURL());
        // $node.find("h4.code").html(code);
        // $("#result_strip ul.thumbnails").prepend($node);
      });
    }
  });
});
