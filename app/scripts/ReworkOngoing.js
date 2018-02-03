$(function(){
	//读取返修中发动机显示到返修台
	var php_url="PHP/DatabaseOperation.php?action=SearchReworkOngoing_db";
	$.get(php_url,function(data){
		// console.log(data);
		var row_items=$.parseJSON(data);
		for(var i=0;i<row_items.length;i++){
			// console.log(row_items[i]);
			// console.log(row_items[i].POSITION);
			var showTableDOM = document.getElementById("ReworkStation"+row_items[i].POSITION);
			showTableDOM.innerHTML=row_items[i].ID;
		}
	});
});

// // 开始返修
// function loadSmallWindow(obj)
// {
// var ss = showModalDialog("ChangeToReworkHTML.html",window,"dialogWidth:150px;dialogHeight:90px;status:no");
// // document.all("ChangeToReoworkButton").value = returnValue1;

// }