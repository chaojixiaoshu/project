var NumberAdd=0;  //序号
var SearchedData;  //SearchedData from mysql
var WeekNo= new Array();  // 存储每个周次
var WeekNoQSearchedDatauantity= new Array();  // 存储每个周次的频率 

function clickSearchButton(){
	// alert('点击了搜索按钮');

	NumberAdd=0;
	SearchedData={};
	console.log(SearchedData);
	//clear table
	var showTableDOM=$("table.showTable"); 
	showTableDOM.html('<tr><td  class="showTableNum" EditType="TextBox" style="font-weight:bold;">序号</td><td  class="showTableState" EditType="TextBox" style="font-weight:bold;">状态</td><td  class="showTableTime" EditType="TextBox" style="font-weight:bold;">时间</td><td  class="showTableType" EditType="DropDownList" style="font-weight:bold;"DataItems="{text:"2740108407",value:"2740108407"},{text:"2740105608",value:"2740105608"},{text:"2700101903",value:"2700101903"},{text:"2700102003",value:"2700102003"}">机型</td><td  class="showTableID" EditType="TextBox"style="font-weight:bold;">发动机号</td><td  class="showTableProblem" EditType="TextBox"style="font-weight:bold;">返修原因</td><td  class="showTablePosition" EditType="TextBox" style="font-weight:bold;">位置</td><td  class="showTableAddButton" style="font-weight:bold;"><a style="text-decoration:none;color:black;" href="javascript:;" id="addButton">操作&nbsp;</a></td></tr>');

	//get search requirement
	var CurrentSearchItem=$("#searchlist").val();
	var CurrentSearchItemValue=$("#searcharea").val();
	// var php_url="PHP/DatabaseOperation.php?action=initialize_db";
	// if (CurrentSearchItem=='全部') {php_url="PHP/DatabaseOperation.php?action=SearchByState_db";}

	if (CurrentSearchItem!="待返修"&&CurrentSearchItem!="全部"&&CurrentSearchItemValue=='') {alert('请输入搜索值！');return;}

	var post_field_SearchContent={};
	post_field_SearchContent['SearchItem']=CurrentSearchItem;
	post_field_SearchContent['SearchItemValue']=CurrentSearchItemValue;
	$.post("PHP/DatabaseOperation.php?action=SearchByPost_db",post_field_SearchContent,function(data){
		
		console.log(data);
		var row_items=$.parseJSON(data);
		
		if (CurrentSearchItem=="待返修"){
			var FinalPriority_items= new Array();   // 存储每项的加权值		
			var date = new Date();   //获取当前时间
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
			}
			//排列数据
			var desc = function(x,y)  
		    {  
		        return y.PRIORITY - x.PRIORITY;
		    } 
		    row_items.sort(desc); 
		}				
		//显示数据
		for(var i=0, j=row_items.length;i<j;i++){
		// row_items[i].PRIORITY=PriorityNumber[i];
		var data_dom=create_row(row_items[i]);
		showTableDOM.append(data_dom);
		}

		SearchedData=row_items;
		console.log(SearchedData);
	});
}
	
	
function create_row(data_item){
	var row_obj=$("<tr></tr>");
	// row_obj.append("<td align='center' bgcolor='#FFFFFF'><input type='checkbox' name='checkbox' value='checkbox' /></td>");
	NumberAdd++;
	var col_td=$("<td align='center' bgcolor='#FFFFFF'></td>");
	col_td.html(NumberAdd);
	row_obj.append(col_td);
	col_td=$("<td align='center' bgcolor='#FFFFFF'></td>");
	col_td.html(data_item['STATE']);
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
	
	//添加删除和编辑按钮
	var deleteButton=$("<a style='text-decoration:none;' href='javascript:;'>&nbsp&nbsp删除&nbsp;</a>");
	deleteButton.attr("deleteID",data_item['ID'])
	deleteButton.click(deleteLine);
	col_td=$("<td align='center' bgcolor='#FFFFFF'></td>");
	col_td.append(deleteButton);
	var editButton=$("<a style='text-decoration:none;' href='javascript:;'>编辑&nbsp;</a>");
	editButton.attr("editNUM",data_item['ID'])
	editButton.click(editLine);
	col_td.append(editButton);
	row_obj.append(col_td);
	var PictureButton=$("<a style='text-decoration:none;' href='javascript:;'>图片&nbsp;</a>");
	PictureButton.attr("eningeID",data_item['ID'])
	PictureButton.click(PictureShow);
	col_td.append(PictureButton);
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
	showTableDOM.append(newRow);		
	
	//确定按钮功能
	confirmButton.click(function(){
		var currentRow=$(this).parent().parent();
		var input_field=currentRow.find("input");
		var post_field={};
//				var updateRow=$("<tr></tr>");
//				updateRow.append("<td align='center' bgcolor='#FFFFFF'><input type='checkbox' name='checkbox' value='checkbox' /></td>");
		post_field['NUM']=input_field[1].value;	
		post_field['STATE']=input_field[2].value;
		post_field['CT_TIME']=input_field[3].value;	
		post_field['TYPE']=input_field[4].value;	
		post_field['ID']=input_field[5].value;	
		post_field['PROBLEM']=input_field[6].value;	
		//将新添的数据更新到界面
		var updateRow=create_row(post_field);
		showTableDOM.append(updateRow);
		//删除当前编辑行
		currentRow.remove();
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
	// alert("点击了删除按钮");
	var linedata=$(this).attr("deleteID");
	var methis=$(this);
	$.post("PHP/DatabaseOperation.php?action=delete_db",{deleteID:linedata},function(res){	
		// alert(res);	
		var deleteresult=$(methis).parent().parent().remove();
		if(deleteresult){}else{alert("删除失败");}
		});	
		// alert("删除执行结束");	
}
//编辑行	
function  editLine(){
	console.log('点击了编辑');
	var linedata=$(this).attr("editNUM");
	var methis=$(this);

	var meRow=$(methis).parent().parent();

	var editRow_obj=$("<tr></tr>");
	// var editTD=$("<td align='center' bgcolor='#FFFFFF'><input type='checkbox' name='checkbox' value='checkbox' /></td>");
	// editTD.find('input').val(meRow.find('td:eq(0)').html());
	// // var editTD=meRow.find('td:eq('+0+')');
	// editRow_obj.append(editTD);

	var editTD=$("<td align='center' bgcolor='#FFFFFF'></td>");
	// editTD.find('input').val(meRow.find('td:eq(0)').html());
	// // var editTD=meRow.find('td:eq('+0+')');
	// editRow_obj.append(editTD);


	for (var i = 0; i < 7; i++) {
		if(i==0){editTD=$("<td><input type='text' style='width:45px;'/></td>");}
		else if (i==1||i==2||i==6) {editTD=$("<td><input type='text' style='width:75px;'/></td>");}
		else{editTD=$("<td><input type='text' style='width:120px;'/></td>");	}
		var valueD=meRow.find('td:eq('+i+')').html();
		editTD.find('input').val(valueD);
		editRow_obj.append(editTD);
	}
	var col_td=$("<td align='center' bgcolor='#FFFFFF'></td>");
	var SaveButton=$("<a style='text-decoration:none;' href='javascript:;'>保存&nbsp;</a>");
	var CancelButton=$("<a style='text-decoration:none;' href='javascript:;'>取消&nbsp;</a>");
	col_td.append(SaveButton);
	col_td.append(CancelButton);
	editRow_obj.append(col_td);

	SaveButton.click(function(){
		var currentRow1=$(this).parent().parent();
		var input_field=currentRow1.find("input");
		var post_field={};
		// post_field['NUM']=input_field[0].value;	
		post_field['STATE']=input_field[1].value;	
		post_field['CT TIME']=input_field[2].value;	
		post_field['TYPE']=input_field[3].value;	
		post_field['ID']=input_field[4].value;	
		post_field['PROBLEM']=input_field[5].value;
		post_field['POSITION']=input_field[6].value;
		post_field['editNUM']=linedata;	
		//将新添的数据更新到界面
		var updateRow=create_row(post_field);
		currentRow1.replaceWith(updateRow);
		//更新到数据库
		$.post("PHP/DatabaseOperation.php?action=updateRow_db",post_field,function(res){
		console.log(res);		
		});
	});
	CancelButton.click(function(){
		var currentRow2=$(this).parent().parent();
		meRow.find('a:eq(0)').click(deleteLine);
		meRow.find('a:eq(1)').click(editLine);
		meRow.find('a:eq(2)').click(PictureShow);
		currentRow2.replaceWith(meRow);
	});
	meRow.replaceWith(editRow_obj);
}
//图片展示	
function  PictureShow(){
	// console.log("点击了picture按钮");
	var linedata=$(this).attr("eningeID");
	var methis=$(this);
	//获取图片URL
	var divPictureURL="";	
	$.post("PHP/DatabaseOperation.php?action=SearchUploadedPicture_db",{eningeID:linedata},function(res){	
		// console.log("db feedback--"+res);	
		var row_items=$.parseJSON(res);
		// console.log("(row_items.length---"+row_items.length);
        if (row_items.length!=1) {alert("出现发动机信息错误，请检查！");return;}        
        uploadedPicturesURL=row_items[0]['PICTUREURL']
        // console.log("uploadedPicturesURL--"+uploadedPicturesURL);
        if (uploadedPicturesURL=='') {alert("该发动机没有上传图片，请检查！");return;}
        
        var PictureURLArray=uploadedPicturesURL.split("\n"); 
        for (var i = 0; i < PictureURLArray.length; i++) {
        	// console.log("----"+PictureURLArray[i]);
        	divPictureURL=divPictureURL+'<div class="swiper-slide"><img src="'+PictureURLArray[i].replace(/..\/Images\//g, "Images\/")+'" class="swiper-lazy"></div>';  
        }
        //新窗口显示图片
		var myNewWindow=window.open('PictureBrowse2.html');
		myNewWindow.onload = function() {
			console.log("Picture Browse 页面加载了！");
			myNewWindow.document.getElementById("divShowPicture").innerHTML = divPictureURL;
		   	// console.log("tianjiawanbi");
		}
	});	
	

}
//ChartBuild
function clickChartButton(){
	console.log('点击了图表生成按钮');

	WeekNo=[];WeekNoQuantity=[];
	SearchedDataCalculate(SearchedData);

	// 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('Div_Chartcontent'));
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '自动统计',
            left:'center'
        },
        tooltip: {},
        toolbox: {
        	show:true,
        	left:'8%',
        	top:'4%',
        	itemSize:10,
        	feature:{
        		saveAsImage:{show:true},
        		dataView:{show:true},
        		restore:{show:true},
        		magicType:{type: ['line', 'bar']}
        	}
        },
        legend: {
            data:['数量'],
            left:'80%',
            top:'5%',
            // textStyle:{
            // 	fontSize:12
            // }
        },
        xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
            name: '数量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };

    //set searchedData into option
    console.log(option.series[0].data);
    option.xAxis.data=WeekNo;
    option.series[0].data=WeekNoQuantity;
    if($("#ChartTitleInput").val()!=''){
    	option.title.text=$("#ChartTitleInput").val();
    }
    

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

}


function getYearWeek(CTtime){ 

	// 计算CT时间
	var ChangeTimeYear=CTtime.substr(0,4);
	var ChangeTimeMonth=CTtime.substr(4,2);
	var ChangeTimeDate=CTtime.substr(6,2);
	var date = new Date(ChangeTimeYear+'/'+ChangeTimeMonth+'/'+ChangeTimeDate+' 12:00:00');
	//calculate weekNo    if not in one year?
    var date2=new Date(date.getFullYear(), 0, 1);  
    var day1=date.getDay();  
    if(day1==0) day1=7;  
    var day2=date2.getDay();  
    if(day2==0) day2=7;  
    d = Math.round((date.getTime() - date2.getTime()+(day2-day1)*(24*60*60*1000)) / 86400000);    
    return Math.ceil(d /7)+1;   
}
function SearchedDataCalculate(row_items){ 
	console.log('get into SearchedDataCalculate');
 	// var WeekNo= new Array();   // 存储每个周次
 	// WeekNo[0]=getYearWeek(row_items[0]['CT TIME']);	
 	// var WeekNoQuantity= new Array();   // 存储每个周次的频率
 	// WeekNoQuantity[0]=1;	

	for(var i=0;i<row_items.length;i++){	
		var row_itemsWeek=getYearWeek(row_items[i]['CT TIME']);
		// var row_itemsWeek=row_items[i]['CT TIME']
		for (var j =0,a=WeekNo.length; j <=a; j++) {
					if (row_itemsWeek==WeekNo[j]) {WeekNoQuantity[j]++;break;}
					else if(j==WeekNo.length){
						WeekNo[j]=row_itemsWeek;
						WeekNoQuantity[j]=1;}
				}
	}
	for(var m=0;m<WeekNo.length;m++){
		console.log(WeekNo[m]+'----'+WeekNoQuantity[m]);
	}

	// sort
	for (var p = 0, b=WeekNo.length; p < b- 1; p++) { // times
        for (var q = 0; q < b - p - 1; q++) { // position
            if (WeekNo[q] > WeekNo[q + 1]) {
                var temp = WeekNo[q];
                WeekNo[q] = WeekNo[q + 1];
                WeekNo[q + 1] = temp;
                var temp2 = WeekNoQuantity[q];
                WeekNoQuantity[q] = WeekNoQuantity[q + 1];
                WeekNoQuantity[q + 1] = temp2;
            }
        }
    }
    //add prefix--CW
    for(var m=0;m<WeekNo.length;m++){
		WeekNo[m]='CW'+WeekNo[m];
		console.log(WeekNo[m]+'----'+WeekNoQuantity[m]);
	}

}