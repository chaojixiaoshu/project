function AA(){
	//统计未放行发动机
	var php_url="PHP/DatabaseOperation.php?action=initialize_db";//数据库返回的是待返修的
	$.ajax({
		type : "get",
		url : php_url,
		async : false,
		success : function(data){
		var row_items=$.parseJSON(data);

		//柱状图数据收集
		var ProblemStatistic=new Array();
		ProblemStatistic[0]=row_items[0].PROBLEM;
		var ProblemNumStatistic=new Array();
		ProblemNumStatistic[0]=1;		
		for(var i=1;i<row_items.length;i++){
			// 统计问题种类和数量
			for (var j =0,a=ProblemStatistic.length; j <a; j++) {
				if (row_items[i].PROBLEM==ProblemStatistic[j]) {ProblemNumStatistic[j]++;break;}
				else if(j==ProblemStatistic.length-1){
					ProblemStatistic[j+1]=row_items[i].PROBLEM;
					ProblemNumStatistic[j+1]=1;}
			}						
		}		
		//排序
		var i = 0, len = ProblemStatistic.length, j, d; 
		for(i=0; i<len-1; i++){ 
			for(j=0; j<len-i-1; j++){ 
				if(ProblemNumStatistic[j] < ProblemNumStatistic[j+1]){ 
				d = ProblemNumStatistic[j]; ProblemNumStatistic[j] = ProblemNumStatistic[j+1]; ProblemNumStatistic[j+1] = d; 
				d = ProblemStatistic[j]; ProblemStatistic[j] = ProblemStatistic[j+1]; ProblemStatistic[j+1] = d;
				} 
			} 
		}
		for (var m = 0; m < ProblemStatistic.length; m++) {
			// console.log('统计结果为：'+ProblemStatistic[m]+'共'+ProblemNumStatistic[m]+'辆\n');
		}
		//筛选TOP5
		var ChooseQuantity=ProblemStatistic.length;
		if (ProblemStatistic.length>5) {ChooseQuantity=5;}
		var SelectTOP5=new Array();
		for (var i = 0; i < ChooseQuantity; i++) {
			var Sectitem={ "title": "进排扭", "amount": "23" };
			Sectitem.title=ProblemStatistic[i];
			Sectitem.amount=ProblemNumStatistic[i];
			SelectTOP5.push(Sectitem);			
		}
		// console.log('TOP5为：'+JSON.stringify(SelectTOP5));
		// console.log(jasonData1.title);
		var dataarray=jasonData1.data;
		dataarray[0].datacollection=SelectTOP5;	
		// console.log(JSON.stringify(dataarray[0].datacollection));
		// console.info('data输出'+JSON.stringify(jasonData1.data));


		//饼图数据收集
		var TypeStatistic=new Array();
		TypeStatistic[0]=row_items[0].TYPE;
		var TypeNumStatistic=new Array();
		TypeNumStatistic[0]=1;		
		for(var i=1;i<row_items.length;i++){
			// 统计问题种类和数量
			for (var j =0,a=TypeStatistic.length; j <a; j++) {
				if (row_items[i].TYPE==TypeStatistic[j]) {TypeNumStatistic[j]++;break;}
				else if(j==TypeStatistic.length-1){
					TypeStatistic[j+1]=row_items[i].TYPE;
					TypeNumStatistic[j+1]=1;}
			}						
		}	
		var TotalType=new Array();
		for (var i = 0; i < TypeStatistic.length; i++) {
			var Sectitem={ "title": "进排扭", "persent": 23 };
			Sectitem.title=TypeStatistic[i].substr(TypeStatistic[i].length-4);
			Sectitem.persent=TypeNumStatistic[i];
			TotalType.push(Sectitem);			
		}
		// var dataarray2=jsonData2.data;
		jsonData2.data=TotalType;	
		// console.info('dataarray2输出'+JSON.stringify(jsonData2.data));
		// for (var m = 0; m < TypeStatistic.length; m++) {
		// 	console.log('统计结果为：'+TypeStatistic[m]+'共'+TypeNumStatistic[m]+'辆\n');
		// }
		}	
	});
}


//柱状图数据
var jasonData1 = {
    "title": "待返修原因统计",
    "verticaltitle": "数量（辆）",
    "horizontaltitle": "返修原因",
    "data": [{ "category": "返修车数量", "datacollection": [{ "title": "进排扭", "amount": "44" }, { "title": "油压", "amount": "2" }] }]    
};

//饼图数据
var jsonData2 = {
    "title": "待返修机型统计",    
    "data": [{ "title": "8407", "persent": 8}, { "title": "1903", "persent": 4},
            { "title": "5608", "persent": 7 }, { "title": "2003", "persent": 6 },
            { "title": "1512", "persent": 3 }]

};


function CaculateStateQuantity(){
	// console.log('进入CaculateStateQuantity函数');
	//获取待返修数目
	var php_url="PHP/DatabaseOperation.php?action=CaculateStateQuantity_db";//数据库返回的是待返修的
	$.ajax({
		type : "get",
		url : php_url,
		async : false,
		success : function(data){
			console.log('数据库返回的data是：'+data);
			var row_items=$.parseJSON(data);
			$('#WaitReworkQuantity').html(row_items.WaitReworkQuantity);
			$('#OnReworkQuantity').html(row_items.OnReworkQuantity);
			$('#WaitCTQuantity').html(row_items.WaitCTQuantity);
			$('#WaitHTQuantity').html(row_items.WaitHTQuantity);
			$('#TotalQuantity').html(row_items.WaitReworkQuantity+row_items.OnReworkQuantity+row_items.WaitCTQuantity+row_items.WaitHTQuantity);
			// var showTableDOM = document.getElementById("WaitReworkQuantity"); 			
			// showTableDOM.innerHTML=row_items.length;
			}
	});
}  






// //ceshi
// function DataChoose() {

// };



 

// DataChoose.prototype.draw = function () {

// 	var jasonData1 = {
// 		    "title": "待返修原因统计",
// 		    "verticaltitle": "数量（辆）",
// 		    "horizontaltitle": "返修原因",
// 		    "data": [{ "category": "返修车数量", "datacollection": [{ "title": "进排扭", "amount": "44" }, { "title": "油压", "amount": "2" }] }]    
// 		};


// 	var php_url="PHP/DatabaseOperation.php?action=initialize_db";//数据库返回的是待返修的
// 	// $.get(php_url,function(data){
// 	// 	var row_items=$.parseJSON(data);
// 	// 	var ProblemStatistic=new Array();
// 	// 	ProblemStatistic[0]=row_items[0].PROBLEM;
// 	// 	var ProblemNumStatistic=new Array();
// 	// 	ProblemNumStatistic[0]=1;		
// 	// 	for(var i=1;i<row_items.length;i++){
// 	// 		// 统计问题种类和数量
// 	// 		for (var j =0,a=ProblemStatistic.length; j <a; j++) {
// 	// 			if (row_items[i].PROBLEM==ProblemStatistic[j]) {ProblemNumStatistic[j]++;break;}
// 	// 			else if(j==ProblemStatistic.length-1){
// 	// 				ProblemStatistic[j+1]=row_items[i].PROBLEM;
// 	// 				ProblemNumStatistic[j+1]=1;}
// 	// 		}						
// 	// 	}		
// 	// 	//排序
// 	// 	var i = 0, len = ProblemStatistic.length, j, d; 
// 	// 	for(i=0; i<len-1; i++){ 
// 	// 		for(j=0; j<len-i-1; j++){ 
// 	// 			if(ProblemNumStatistic[j] < ProblemNumStatistic[j+1]){ 
// 	// 			d = ProblemNumStatistic[j]; ProblemNumStatistic[j] = ProblemNumStatistic[j+1]; ProblemNumStatistic[j+1] = d; 
// 	// 			d = ProblemStatistic[j]; ProblemStatistic[j] = ProblemStatistic[j+1]; ProblemStatistic[j+1] = d;
// 	// 			} 
// 	// 		} 
// 	// 	}
// 	// 	for (var m = 0; m < ProblemStatistic.length; m++) {
// 	// 		console.log('统计结果为：'+ProblemStatistic[m]+'共'+ProblemNumStatistic[m]+'辆\n');
// 	// 	}
// 	// 	//筛选TOP5
// 	// 	var ChooseQuantity=ProblemStatistic.length;
// 	// 	if (ProblemStatistic.length>5) {ChooseQuantity=5;}
// 	// 	var SelectTOP5=new Array();
// 	// 	for (var i = 0; i < ChooseQuantity; i++) {
// 	// 		var Sectitem={ "title": "进排扭", "amount": "23" };
// 	// 		Sectitem.title=ProblemStatistic[i];
// 	// 		Sectitem.amount=ProblemNumStatistic[i];
// 	// 		SelectTOP5.push(Sectitem);			
// 	// 	}
// 	// 	console.log('TOP5为：'+JSON.stringify(SelectTOP5));
// 	// 	// console.log(jasonData1.title);
		
// 	// 	var dataarray=jasonData1.data;
// 	// 	dataarray[0].datacollection=SelectTOP5;	
// 	// 	// console.log(JSON.stringify(dataarray[0].datacollection));
// 	// 	// console.info('data输出'+JSON.stringify(jasonData1.data));	
		
// 	// 	console.info('jasonData1输出'+JSON.stringify(jasonData1));
// 	// });

// 	$.ajax({
// 		type : "get",
// 		url : php_url,
// 		async : false,
// 		success : function(data){
// 			var row_items=$.parseJSON(data);
// 			var ProblemStatistic=new Array();
// 			ProblemStatistic[0]=row_items[0].PROBLEM;
// 			var ProblemNumStatistic=new Array();
// 			ProblemNumStatistic[0]=1;		
// 			for(var i=1;i<row_items.length;i++){
// 				// 统计问题种类和数量
// 				for (var j =0,a=ProblemStatistic.length; j <a; j++) {
// 					if (row_items[i].PROBLEM==ProblemStatistic[j]) {ProblemNumStatistic[j]++;break;}
// 					else if(j==ProblemStatistic.length-1){
// 						ProblemStatistic[j+1]=row_items[i].PROBLEM;
// 						ProblemNumStatistic[j+1]=1;}
// 				}						
// 			}		
// 			//排序
// 			var i = 0, len = ProblemStatistic.length, j, d; 
// 			for(i=0; i<len-1; i++){ 
// 				for(j=0; j<len-i-1; j++){ 
// 					if(ProblemNumStatistic[j] < ProblemNumStatistic[j+1]){ 
// 					d = ProblemNumStatistic[j]; ProblemNumStatistic[j] = ProblemNumStatistic[j+1]; ProblemNumStatistic[j+1] = d; 
// 					d = ProblemStatistic[j]; ProblemStatistic[j] = ProblemStatistic[j+1]; ProblemStatistic[j+1] = d;
// 					} 
// 				} 
// 			}
// 			for (var m = 0; m < ProblemStatistic.length; m++) {
// 				console.log('统计结果为：'+ProblemStatistic[m]+'共'+ProblemNumStatistic[m]+'辆\n');
// 			}
// 			//筛选TOP5
// 			var ChooseQuantity=ProblemStatistic.length;
// 			if (ProblemStatistic.length>5) {ChooseQuantity=5;}
// 			var SelectTOP5=new Array();
// 			for (var i = 0; i < ChooseQuantity; i++) {
// 				var Sectitem={ "title": "进排扭", "amount": "23" };
// 				Sectitem.title=ProblemStatistic[i];
// 				Sectitem.amount=ProblemNumStatistic[i];
// 				SelectTOP5.push(Sectitem);			
// 			}
// 			console.log('TOP5为：'+JSON.stringify(SelectTOP5));
// 			// console.log(jasonData1.title);
			
// 			var dataarray=jasonData1.data;
// 			dataarray[0].datacollection=SelectTOP5;	
// 			// console.log(JSON.stringify(dataarray[0].datacollection));
// 			// console.info('data输出'+JSON.stringify(jasonData1.data));	
			
// 			console.info('jasonData1输出'+JSON.stringify(jasonData1));
// 	}
// 	});
// 	console.info('jasonData1--------输出'+JSON.stringify(jasonData1));

// 	return jasonData1;

// }