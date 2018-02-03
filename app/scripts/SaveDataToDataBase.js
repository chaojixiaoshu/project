// JavaScript Document
function ClickSubmit(){  
	 // alert('点击了确定---！');
	//获取所有的新增信息
	var ItemVal_Number = $("#Item_Number").val();
	var ItemVal_Type = $("#Item_Type").val();
	var ItemVal_Date = $("#Item_Date").val();
	var ItemVal_Position = $("#Item_Position").val();
	var ItemVal_Reason = $("#Item_Reason").val();
	var ItemVal_IsPriority= $("#Item_IsPriority").val();
	
	//alert(ItemVal_Number+ItemVal_Type+ItemVal_Date+ItemVal_Position+ItemVal_Reason+ItemVal_IsPriority);
	//验证发动机号是否重复
	var post_field_EngineID={};
	post_field_EngineID['EngineID']=ItemVal_Number;
	post_field_EngineID['EnginePosition']=ItemVal_Position;
	$.post("PHP/DatabaseOperation.php?action=Search_db",post_field_EngineID,function(res){
		// console.log('接收到数据库的数据为：'+res);
		// console.log(typeof(res));
		if(res != "[]"){
			alert("\n数据库中已经录入该发动机！\n");
		}
		else{
			//验证位置是否重复
			$.post("PHP/DatabaseOperation.php?action=SearchByPosition_db",post_field_EngineID,function(res1){
			console.log('接收到数据库的数据为：'+res1);
			if(res1 != "[]"){
				alert("\n该位置已经有发动机，请重新选择位置！\n");
			}
			else{
					//存入数据库
					//连接数据库
					// var php_url="PHP/DatabaseOperation.php?action=initialize_db";
					// var dataNumber=0;
					// var data_items={};
					// console.log('点击了确定');
					// $.get(php_url,function(data){
					// 	 data_items=$.parseJSON(data);
					// 	 dataNumber=data_items.length;
					// 	 console.log('内部值为：'+dataNumber);
					// });
					var dataNumber=0;
					$.ajax({
				        url: "PHP/DatabaseOperation.php?action=initialize_db",
				        async: false,//改为同步方式
				        type: "get",
				        success: function (data) {
				            var data_items=$.parseJSON(data);
						 	dataNumber=data_items.length;
						 	// console.log('内部值为：'+dataNumber);
				        }
				    });
					// console.log('外部值为：'+dataNumber);
					//传递数据	
					var post_field={};
					post_field['NUM']=dataNumber+1;
					post_field['CT TIME']=ItemVal_Date;	
					post_field['TYPE']=ItemVal_Type;	
					post_field['ID']=ItemVal_Number;	
					post_field['PROBLEM']=ItemVal_Reason;
					post_field['POSITION']=ItemVal_Position;		
					post_field['ISPRIORITY']=ItemVal_IsPriority;
					post_field['STATE']='待返修';	
					$.post("PHP/DatabaseOperation.php?action=addRow_db",post_field,function(res){
						// alert(res);
						if(res != "[]"){
							alert('\n返修车新增成功！\n');
						}
						else{alert('\n返修车新增失败！\n');}		
					});	
				}
		
			});
		}

	});	
}  

function ClickCancel(){  
	alert("进入-------ClickCancel");
} 


$(function() {
	$("#ReadBarcode").on("click", function(e) {
		alert("clicked button--");
		var input = document.querySelector("#CaptureBarcode");
		// alert("input--"+input.files[0]);
		if (input.files && input.files.length) {
			// alert("1--");
		  Quagga.decodeSingle({
		    inputStream: {
		      size: 1600 // 这里指定图片的大小，需要自己测试一下
		    },
		    locator: {
		      patchSize: "medium",  
		      halfSample: false
		    },
		    numOfWorkers: 1,
		    decoder: {
		      readers: [{
		        // format: "ean_reader",// 这里指定ean条形码，就是国际13位的条形码
		        format: "code_128_reader",
		        config: {}
		      }]
		    },
		    locate: true,
		    src: URL.createObjectURL(input.files[0])
		  }, function(result) {alert("进入结果反馈！");
		  	 if (result.codeResult==null) {alert("图片条形码无法识别！"); return;}
		     var code = result.codeResult.code;
		    // 将扫描得到的条形码打印出来
		    if (code==null) {alert("图片条形码无法识别2222！");}
		    $("#Item_Number").val(code);
		    alert("code--"+code);
		  });
		}
	});
});
// $(function() {
//    $(".controls button").on("click", function(e) {
//     var input = document.querySelector(".controls input[type=file]");
//     if (input.files && input.files.length) {
//       Quagga.decodeSingle({
//         inputStream: {
//           size: 800 // 这里指定图片的大小，需要自己测试一下
//         },
//         locator: {
//           patchSize: "medium",
//           halfSample: false
//         },
//         numOfWorkers: 1,
//         decoder: {
//           readers: [{
//             format: "ean_reader",// 这里指定ean条形码，就是国际13位的条形码
//             config: {}
//           }]
//         },
//         locate: true,
//         src: URL.createObjectURL(input.files[0])
//       }, function(result) {
//          var code = result.codeResult.code,
//           $node,
//           canvas = Quagga.canvas.dom.image;
//         // 将扫描得到的条形码打印出来
//         $node = $('<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>');
//         $node.find("img").attr("src", canvas.toDataURL());
//         $node.find("h4.code").html(code);
//         $("#result_strip ul.thumbnails").prepend($node);
//       });
//     }
//   });
// });
