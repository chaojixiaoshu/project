// JavaScript Document
//得到php返回的数据库数据，
$(function(){ 
	// console.log("ConnPHP__JS--");
	var GlobalValueForCurrentReworkedEngineID='';
	//alert("进入js！！！");
	var php_url="PHP/DatabaseOperation.php?action=initialize_db";
	<!--var showTableDOM = document.getElementById("showTable");  	-->
	var showTableDOM0=$("table.showTable0");
	// var showTableDOM=$("table.showTable"); 
	$.get(php_url,function(data){
		// console.log(data);
		var row_items=$.parseJSON(data);
		// alert(row_items);
		//筛选数据
		var FinalPriority_items= new Array();   // 存储每项的加权值
		//获取当前时间
		var date = new Date();
		for(var i=0;i<row_items.length;i++){	
			FinalPriority_items[i]=0;
			if(row_items[i].ISPRIORITY=="高度优先"){FinalPriority_items[i]+=50;	 }	
				else if(row_items[i].ISPRIORITY=="一般优先"){FinalPriority_items[i]+=25;}

			// 计算距离当前的时间
			var ChangeTimeYear=row_items[i]['CT TIME'].substr(0,4);
			var ChangeTimeMonth=row_items[i]['CT TIME'].substr(4,2);
			var ChangeTimeDate=row_items[i]['CT TIME'].substr(6,2);
			var recordDate = new Date(ChangeTimeYear+'/'+ChangeTimeMonth+'/'+ChangeTimeDate+' 12:00:00');
			
			var diff=(date.getTime() - recordDate.getTime())/(24 * 60 * 60 * 1000);
			FinalPriority_items[i]+=parseInt(diff.toFixed(0));
			//计算问题的数量
			  var IssueNum=0;
			  for(var m=0;m<row_items.length;m++){
				  if(row_items[i]['PROBLEM']==row_items[m]['PROBLEM']) IssueNum++;
			  }
			FinalPriority_items[i]+=IssueNum*3;
			row_items[i].PRIORITY=FinalPriority_items[i];
			// alert('PRIORITY属性是：'+row_items[i].PRIORITY); 
		}
		//排列数据
		var desc = function(x,y)  
	    {  
	        // return (x.PRIORITY < y.PRIORITY) ? 1 : -1;  
	        // 不知道这句为啥不成功，没有考虑0的情况
	        return y.PRIORITY - x.PRIORITY;
	    } 
	    // var json_data = JSON.stringify(row_items); 
	    row_items.sort(desc); 
	    // console.log(row_items);
	    // console.log(typeof(json_data));
	    // console.log(typeof(data));
	    // alert('排序后数据是：'+json_data);

	    // //将优先级转化为从1开始的连续整数
	    // var PriorityNumber=Array();	
	    // PriorityNumber[0]=1;  
	    // for(var i=1;i<row_items.length;i++){
	    // 	if(row_items[i-1].PRIORITY==row_items[i].PRIORITY){
	    // 		PriorityNumber[i]=PriorityNumber[i-1];
	    // 	}
	    // 	else{PriorityNumber[i]=PriorityNumber[i-1]+1;}
	    // }
		//显示数据
		for(var i=0, j=row_items.length;i<j;i++){
		// row_items[i].PRIORITY=PriorityNumber[i];
		row_items[i].NUM=i+1;
		var data_dom=create_row(row_items[i]);
		showTableDOM0.append(data_dom);
		// showTableDOM.append(data_dom);
		}

		//显示到待返修区
		for(var i=0;i<row_items.length;i++){
			var ReworkStationArea = document.getElementById("ReworkStation"+row_items[i].POSITION);
			if(ReworkStationArea!=null){
				ReworkStationArea.innerHTML=row_items[i].ID;}			
		}

	});
	
	function create_row(data_item){
	<!--		debugger;		return $("<tr><td colspan='8'><h1>"+data_item.val+"</hi></td></tr>");-->
//	var columnTitle=new Array("NUM","CT TIME","TYPE","ID","PROBLEM");
	
		var row_obj=$("<tr></tr>");
		row_obj.append("<td align='center' bgcolor='#FFFFFF'><input type='checkbox' name='checkbox' value='checkbox' /></td>");

			var col_td=$("<td align='center' bgcolor='#FFFFFF'></td>");
			col_td.html(data_item.NUM);
			row_obj.append(col_td);
			col_td=$("<td align='center' bgcolor='#FFFFFF'></td>");
			col_td.html(data_item['CT TIME']);
			row_obj.append(col_td);
			col_td=$("<td align='center' bgcolor='#FFFFFF'></td>");
			col_td.html(data_item['TYPE']);
			row_obj.append(col_td);
			col_td=$("<td align='center' bgcolor='#FFFFFF'></td>");
			col_td.html(data_item['ID']);
			row_obj.append(col_td);
			col_td=$("<td align='center' bgcolor='#FFFFFF'></td>");
			col_td.html(data_item['PROBLEM']);
			row_obj.append(col_td);
			col_td=$("<td align='center' bgcolor='#FFFFFF'></td>");
			col_td.html(data_item['POSITION']);
			row_obj.append(col_td);
			col_td=$("<td align='center' bgcolor='#FFFFFF'></td>");
			col_td.html(data_item['PRIORITY']);
			row_obj.append(col_td);
			
			//创建两个空的单元格
			// var opt1_td=$("<td align='center' bgcolor='#FFFFFF'></td>");
			// row_obj.append(opt1_td);
			// var opt2_td=$("<td align='center' bgcolor='#FFFFFF'></td>");
			// row_obj.append(opt2_td);
			
			//添加删除和编辑按钮
			var deleteButton=$("<a style='text-decoration:none;' href='javascript:;'>删除&nbsp;</a>");
			deleteButton.attr("deleteID",data_item.ID)
			deleteButton.click(deleteLine);
			col_td=$("<td align='center' bgcolor='#FFFFFF'></td>");
			col_td.append(deleteButton);
			var editButton=$("<a style='text-decoration:none;' href='javascript:;'>返修&nbsp;</a>");
			editButton.attr("ReworkID",data_item.ID)
			editButton.attr("PositionNow",data_item.POSITION)
			editButton.attr("ReworkProblem",data_item.PROBLEM)
			editButton.click(ChangeToReworkButton);
			col_td.append(editButton);
			row_obj.append(col_td);
	
		return row_obj;
	}
	
	//添加功能
	$("#addButton").click(function(){
		var newRow=$("<tr></tr>");
		newRow.append("<td class='showTableNo'><input type='checkbox' style='width:20px;'/></td>");	
		newRow.append("<td class='showTableNo'><input type='text' style='width:30px;'/></td>");	
		newRow.append("<td class='showTableNo'><input type='text' style='width:110px;'/></td>");	
		newRow.append("<td class='showTableNo'><input type='text' style='width:95px;'/></td>");	
		newRow.append("<td class='showTableNo'><input type='text' style='width:135px;'/></td>");	
		newRow.append("<td class='showTableNo'><input type='text' style='width:115px;'/></td>");	
		newRow.append("<td class='showTableNo'><input type='text' style='width:30px;'/></td>");	
		newRow.append("<td class='showTableNo'><input type='text' style='width:40px;'/></td>");		
		var confirmButton=$("<a style='text-decoration:none;' href='javascript:;'>确定&nbsp;</a>");
		var cancelButton=$("<a style='text-decoration:none;' href='javascript:;'>取消&nbsp;</a>");
		var helptd=$("<td align='center' bgcolor='#FFFFFF'></td>");
		helptd.append(confirmButton);
		helptd.append(cancelButton);
		newRow.append(helptd);
		showTableDOM0.append(newRow);	
		// showTableDOM.append(newRow);		
		
		//确定按钮功能
		confirmButton.click(function(){
			var currentRow=$(this).parent().parent();
			var input_field=currentRow.find("input");
			var post_field={};
			post_field['NUM']=input_field[1].value;	
			post_field['CT TIME']=input_field[2].value;	
			post_field['TYPE']=input_field[3].value;	
			post_field['ID']=input_field[4].value;	
			post_field['PROBLEM']=input_field[5].value;	
			//将新添的数据更新到界面
			var updateRow=create_row(post_field);
			showTableDOM0.append(updateRow);
			// showTableDOM.append(updateRow);
			//删除当前编辑行
			currentRow.remove();			
//				for (var i=1,j=input_field.length;i<j;i++){ //i等于1因为第一个input 为勾选框
//					post_field['col'+i]=input_field[i].value;	
//					//将新添的数据更新到界面
//					var inputString=$("<td align='center' bgcolor='#FFFFFF'></td>");
//					inputString.append(input_field[i].value);		
//					updateRow.append(inputString);					
//	//				alert(post_field['col'+i]);				
//				}
//				showTableDOM.append(updateRow);	
			$.post("PHP/DatabaseOperation.php?action=addRow_db",post_field,function(res){
			});			
		});
		//取消按钮功能
		cancelButton.click(function(){
			$(this).parent().parent().remove();
		});
	});
	
//删除行和数据库	
	function  deleteLine(){
		var linedata=$(this).attr("deleteID");
		var methis=$(this);
//		alert($(methis).parent().parent().text());
		$.post("PHP/DatabaseOperation.php?action=delete_db",{deleteID:linedata},function(res){		
			var deleteresult=$(methis).parent().parent().remove();
			if(deleteresult){}else{alert("删除失败");}
			});		
	}
// “返修”按钮
	function  ChangeToReworkButton(){
		// 无法支持Chrome的方法： var ReworkPosition = showModalDialog("ChangeToReworkHTML.html",window,"dialogWidth:200px;dialogHeight:90px;status:no");
		// 不易获取返回值和实现模态控制的方法：window.myNewWindow = window.open("ChangeToReworkHTML.html","_blank","Width=200px,Height=90px,status:no");

		var methis=$(this);  //将当前点击的返修控件存储起来
		// alert('methis'+$(methis).text());

		//创建选择返修台的两个QIV，一个负责覆盖原界面，一个需在提供返修台选项
		var previewHTML = '	<div id="preview-shadow" class="overlay-shadow animated fadeIn"></div><div id="preview-box" class="OverLayTopDIV"><form action="" method="get">请选择一个空返修台：<br /><br /> <label><input name="ReworkStationGroup" type="radio" value="ReworkStation1" />返修台1<br /> </label><label><input name="ReworkStationGroup" type="radio" value="ReworkStation2" />返修台2<br /> </label><label><input name="ReworkStationGroup" type="radio" value="ReworkStation3" />返修台3<br /> </label><label><input name="ReworkStationGroup" type="radio" value="ReworkStation4" />返修台4<br /></label><label><input name="ReworkStationGroup" type="radio" value="ReworkStation5" />返修台5<br /> </label><label><input name="ReworkStationGroup" type="radio" value="ReworkStation6" />返修台6<br /></label></form><br /><input id="SubmitSelectedStation" type="submit" value = "确定" />&nbsp&nbsp<input id="CancelSelectedStation" type="button" value = "取消" /><p></p></div>';

        $('#ShowReworkStationSlelectionDIV').html(previewHTML);
        //选择返修台后，点击确定
        $("#SubmitSelectedStation").click(function(){
   //      	var ReworkPosition=document.all("sel_sex").value;			
			var obj,ReworkPosition;    
		    obj=document.getElementsByName('ReworkStationGroup');
		    if(obj!=null){
		        var i;
		        for(i=0;i<obj.length;i++){
		            if(obj[i].checked){
		                ReworkPosition=obj[i].value;            
		            }
		        }
		    }
		    // alert('获取的返修台号为：'+ReworkPosition);
			//删除选择返修台div，回到主界面
			$('#ShowReworkStationSlelectionDIV').empty();

			if(ReworkPosition!=""){
				var ReworkPositionNumber=ReworkPosition.substr(13,1);
				//判断对应返修台是否为空
				//注意：此时$(methis)不等于$(this)，必须用$(methis)
				var linedata=$(methis).attr("ReworkID");
				var Positiondata=$(methis).attr("PositionNow");
				var Problemdata=$(methis).attr("ReworkProblem");
				$.post("PHP/DatabaseOperation.php?action=ChangeToRework_db",{ReworkID:linedata,ReworkPosition:ReworkPositionNumber},function(res){		
					// alert(res);
					var deleteresult=$(methis).parent().parent().remove();
					if(deleteresult){}else{alert("删除失败");}
					// 更新返修车分布
					var deleteReworkItem = document.getElementById("ReworkStation"+ReworkPositionNumber);
					deleteReworkItem.innerHTML=linedata;
					// 更新滞留车分布
					var deleteReworkItem2 = document.getElementById("ReworkStation"+Positiondata);
					deleteReworkItem2.innerHTML='';
					});	
				//弹出返修提示
				switch(Problemdata){
				case '进排扭':alert("此发动机为进排气扭矩不合格，请注意以下步骤：\n 1.检查四个缸的进排气气门；\n2.更换燃油轨密封圈。\n3.详细返工步骤见ERA-WI274-001。");break;
				case '油压':alert("此发动机为油压不合格，请注意以下步骤：\n 1.检查机滤密封圈是否破损；\n2.检查机油适配器是否漏油。\n3.详细返工步骤见ERA-WI274-001。");break;	
				case 'CCT':alert("此发动机为CCT不合格，请注意以下步骤：\n 1.检查曲位安装是否到位；\n2.检查凸轮轴圆跳和深度。\n3.详细返工步骤见ERA-WI274-001。");break;
				case 'VVT':alert("此发动机为VVT不合格，请注意以下步骤：\n 1.检查电磁阀插头安装是否到位；\n2.检查正时轮和中心阀。\n3.详细返工步骤见ERA-WI274-001。");break;
				case '扭矩':alert("此发动机为扭矩不合格，请注意以下步骤：\n 1.检查脉冲盘是否有磨损；\n2.检查缸筒是否划伤。\n3.详细返工步骤见ERA-WI274-001。");break;
				case 'NVH':alert("此发动机为NVH不合格，请注意以下步骤：\n 1.检查机油泵是否卡滞；\n2.检查平衡轴齿是否磕伤。\n3.详细返工步骤见ERA-WI274-001。");break;
				}
			}else{alert("返修台号获取失败！");}	
			//需要刷新主界面，更新状态统计数据	
        location.reload(true);	
        });
        $("#CancelSelectedStation").click(function(){
        	// alert("点击了取消返修台的按钮！");
        	$('#ShowReworkStationSlelectionDIV').empty();

        });

	}

	//返修完成，下返修台
	$("#ReworkFinishButton6").click(function(){
		var ReworkPosition= document.getElementById("ReworkStation6");
		if(ReworkPosition!=null){
			if(ReworkPosition.innerHTML==''){alert("该返修台没有返修中的发动机，请重新选择！");}
			else if(confirm("确定结束 "+ReworkPosition.innerHTML+" 的返修？")==true){
				// alert("用户点击了下返修台！");
				//修改数据库中的状态
				var methis=$(this);
				$.post("PHP/DatabaseOperation.php?action=ReworkFinish_db",{ReworkFinishID:ReworkPosition.innerHTML},function(res){		
					// alert(res);
					ReworkPosition.innerHTML='';
				});	
			}
		}
	});
	$("#ReworkFinishButton5").click(function(){
		var ReworkPosition= document.getElementById("ReworkStation5");
		if(ReworkPosition!=null){
			if(ReworkPosition.innerHTML==''){
				alert("该返修台没有返修中的发动机，请重新选择！");
			}
			else if(confirm("确定结束 "+ReworkPosition.innerHTML+" 的返修？")==true){
				// alert("用户点击了下返修台！");
				//进行质量检查
				document.cookie='CurrentReworkedEngineID =' +ReworkPosition.innerHTML;
				// window.location("QualityCheck.html"); 
				var myWindow=window.open('QualityCheck.html','_self',false);
				// window.CurrentReworkedEngineID=ReworkPosition.innerHTML;
				// GlobalValueForCurrentReworkedEngineID=ReworkPosition.innerHTML;
				// alert("GlobalValueForCurrentReworkedEngineID---"+GlobalValueForCurrentReworkedEngineID);
				// myWindow.onload = function() {alert("页面加载了！");
				//     myWindow.document.getElementById("engineInfor").innerHTML = '1212121';
				// }
				// window.opener.document.getElementById("engineInfor").innerHTML = '1212121';

				//修改数据库中的状态
				var methis=$(this);
				$.post("PHP/DatabaseOperation.php?action=ReworkFinish_db",{ReworkFinishID:ReworkPosition.innerHTML},function(res){		
					console.log(res);
					ReworkPosition.innerHTML='';
				});	
			}
		}
	});
	$("#ReworkFinishButton4").click(function(){
		var ReworkPosition= document.getElementById("ReworkStation4");
		if(ReworkPosition!=null){
			if(ReworkPosition.innerHTML==''){alert("该返修台没有返修中的发动机，请重新选择！");}
			else if(confirm("确定结束 "+ReworkPosition.innerHTML+" 的返修？")==true){
				// alert("用户点击了下返修台！");
				//修改数据库中的状态
				var methis=$(this);
				$.post("PHP/DatabaseOperation.php?action=ReworkFinish_db",{ReworkFinishID:ReworkPosition.innerHTML},function(res){		
					// alert(res);
					ReworkPosition.innerHTML='';
				});	
			}
		}
	});
	$("#ReworkFinishButton3").click(function(){
		var ReworkPosition= document.getElementById("ReworkStation3");
		if(ReworkPosition!=null){
			if(ReworkPosition.innerHTML==''){alert("该返修台没有返修中的发动机，请重新选择！");}
			else if(confirm("确定结束 "+ReworkPosition.innerHTML+" 的返修？")==true){
				// alert("用户点击了下返修台！");
				//修改数据库中的状态
				var methis=$(this);
				$.post("PHP/DatabaseOperation.php?action=ReworkFinish_db",{ReworkFinishID:ReworkPosition.innerHTML},function(res){		
					// alert(res);
					ReworkPosition.innerHTML='';
				});	
			}
		}
	});
	$("#ReworkFinishButton2").click(function(){
		var ReworkPosition= document.getElementById("ReworkStation2");
		if(ReworkPosition!=null){
			if(ReworkPosition.innerHTML==''){alert("该返修台没有返修中的发动机，请重新选择！");}
			else if(confirm("确定结束 "+ReworkPosition.innerHTML+" 的返修？")==true){
				// alert("用户点击了下返修台！");
				//修改数据库中的状态
				var methis=$(this);
				$.post("PHP/DatabaseOperation.php?action=ReworkFinish_db",{ReworkFinishID:ReworkPosition.innerHTML},function(res){		
					// alert(res);
					ReworkPosition.innerHTML='';
				});	
			}
		}
	});
	$("#ReworkFinishButton1").click(function(){
		var ReworkPosition= document.getElementById("ReworkStation1");
		if(ReworkPosition!=null){
			if(ReworkPosition.innerHTML==''){alert("该返修台没有返修中的发动机，请重新选择！");}
			else if(confirm("确定结束 "+ReworkPosition.innerHTML+" 的返修？")==true){
				// alert("用户点击了下返修台！");
				//修改数据库中的状态
				var methis=$(this);
				$.post("PHP/DatabaseOperation.php?action=ReworkFinish_db",{ReworkFinishID:ReworkPosition.innerHTML},function(res){		
					// alert(res);
					ReworkPosition.innerHTML='';
				});	
			}
		}
	});





  });