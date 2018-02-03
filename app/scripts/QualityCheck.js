$(function(){

    // alert("Quality__JS");
	
	// alert("window.CurrentReworkedEngineID---"+GlobalValueForCurrentReworkedEngineID);
	// var engineInforLabel=document.getElementById("engineInfor");
	// engineInforLabel.innerHTML=GlobalValueForCurrentReworkedEngineID;


    //get engine ID
    var engineIDtoUpload=document.getElementById("engineInfor").innerHTML;
    console.log("当前的发动机号是--"+engineIDtoUpload);
    //show uploaded pictures
    // var php_url="PHP/DatabaseOperation.php?action=SearchUploadedPicture_db";
    // <!--var showTableDOM = document.getElementById("showTable");    -->
    // var showTableDOM0=$("table.showTable0");
    // // var showTableDOM=$("table.showTable"); 
    $.post("PHP/DatabaseOperation.php?action=SearchUploadedPicture_db",{eningeID:engineIDtoUpload},function(data){
    // $.get(php_url,function(data){
        var row_items=$.parseJSON(data);
        if (row_items.length>1) {alert("出现发动机信息错误，请检查！");return}
        uploadedPicturesURL=row_items[0]['PICTUREURL']
        console.log("uploadedPicturesURL--"+uploadedPicturesURL);
        document.getElementById("showUploadedPictures").innerHTML=uploadedPicturesURL.replace(/..\/Images\//g, "");

    });

	
	//质量检查拍照
	$("#QualityCheckPhotoCaptureButton").click(function(){
		// alert("clicked photo button！");
		// var agent = navigator.userAgent.toLowerCase();
	 //    var res = agent.match(/android/);	    
	 //    if(res != "android"){
	 //    	res = agent.match(/iphone/);
	 //       	if(res != "iphone")res = agent.match(/ipad/);

	 //    res = agent.match(/ipad/);
	 //    if(res == "ipad")

	 //    res = agent.match(/windows/);
	 //    if(res == "windows");
	 //    }
	 //    alert("当前登录了客户端为："+res);


        navigator.getUserMedia = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

        if(navigator.getUserMedia){
            alert("support camera and microphone！");
        } else {
            alert("not---support camera and microphone！");
        }


        var w = 320, h = 240;                                       //摄像头配置,创建canvas
        var pos = 0, ctx = null, saveCB, image = [];
        var canvas = document.createElement("canvas");
        $("body").append(canvas);
        canvas.setAttribute('width', w);
        canvas.setAttribute('height', h);
        ctx = canvas.getContext("2d");
        image = ctx.getImageData(0, 0, w, h);

        $("#webcam").webcam({
            width: w,
            height: h,
            mode: "callback",                       //stream,save，回调模式,流模式和保存模式
            swffile: "jQuery-webcam-master/jscam_canvas_only.swf",
            onTick: function(remain) { 
                if (0 == remain) {
                    $("#status").text("拍照成功!");
                } else {
                    $("#status").text("倒计时"+remain + "秒钟...");
                }
            },
            onSave: function(data){              //保存图像
                var col = data.split(";");
                var img = image;
                for(var i = 0; i < w; i++) {
                    var tmp = parseInt(col[i]);
                    img.data[pos + 0] = (tmp >> 16) & 0xff;
                    img.data[pos + 1] = (tmp >> 8) & 0xff;
                    img.data[pos + 2] = tmp & 0xff;
                    img.data[pos + 3] = 0xff;
                    pos+= 4;
                }
                if (pos >= 4 * w * h) {
                    ctx.putImageData(img,0,0);      //转换图像数据，渲染canvas
                    pos = 0;
                    Imagedata=canvas.toDataURL().substring(22);  //上传给后台的图片数据
                }
            },
            onCapture: function () {               //捕获图像
                webcam.save();      
            },
            debug: function (type, string) {       //控制台信息
                console.log(type + ": " + string);
            },
            onLoad: function() {                   //flash 加载完毕执行
                console.log('加载完毕！')
                var cams = webcam.getCameraList();
                for(var i in cams) {
                    $("body").append("<p>" + cams[i] + "</p>");
                }
            }
        });  

	});
	// Choose pictures	
	$("#UploadSubmitButton").click(function() {
        var coverFormData = new FormData();
		console.log('click upload button！');
        // var oFiles = $("#QualityCheckPhotoChooseButton").files;
        var oFiles = document.getElementById("QualityCheckPhotoChooseButton").files;
        if (oFiles.length==0) {alert("当前没有选择图片，请选择后再提交！");return;}
        for (var i = 0; i < oFiles.length; i++) {
            var file = oFiles[i];
            if (!file.type.match('image.*')) {
              continue;
            }
            console.log(file.name);
            coverFormData.append('Cover[]', file, file.name);
        }
        console.log(coverFormData);
        // upload(coverImageId, coverFormData);
        coverFormData.append('currentEngineID[]',oFiles[0],document.getElementById("engineInfor").innerHTML);

        //上传
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (xhr.status === 200) {
                    alert("上传成功！");
                    //delete selected files 
                     var obj = document.getElementById('QualityCheckPhotoChooseButton') ; 
                    obj.outerHTML=obj.outerHTML; 

                    var returnData = xhr.responseText;
                    console.log("返回值为："+returnData);                    
                } else {
                    alert("返回错误数据！");
                }
            } else {
                // document.getElementById("QualityCheckPhotoChooseButton").value = "上传中……";
            }
        };
        xhr.open("POST", "PHP/DatabaseOperation.php?action=UploadPicture_db", true);
        xhr.send(coverFormData);
        coverFormData.delete('Cover[]');        
    });


});