 var appScrum = "https://script.google.com/macros/s/AKfycbw3gVmB4tDMblKBHvlcUCcdYfd6P8O-8vY6gHEyHoC1FBzYrKZG/exec";
 var appAuthen = "https://script.google.com/macros/s/AKfycbwYfN9v_dFeSvT9dJi9DYLxySW9uPIvktkYie4RaXozZJpYtwM/exec";
 var STATETODO = 1;
 var STATEONGOING = 2;
 var STATEDONE = 3;
 var STATEHISTORY = 4;

 var history_en = false;
 var task_id_to_edit;
 tasks_set = {};
 var curr_key;
 
 var p2div = function(paragraph){
	var div_content="";
	var p_set = paragraph.split('\n');
	for (i in p_set){
		div_content+=p_set[i];
		div_content+="</br>";
	}
	return div_content;
 }

 var ShowHistory = function(){
	 if(history_en){
		$('#div_history').hide();
		history_en = false;
	 }else{
		$('#div_history').show();
		history_en = true;
	 }
 }
 var ToAddTask = function(){
	$('#edit_div_content_title').val("");
	$('#edit_div_content_content').val("");
	$('#edit_div_content_tag').val("");
	$('#edit_div_content_priority').val("");

	 $('#edit_div').show();
	 $('#edit_div').attr('add_or_edit','add');
 }

 var SaveTask = function(){
	 //console.log(scrum_set);
	switch($('#edit_div').attr('add_or_edit')){
		case 'add':

			$.get(
				appScrum,{
					  "command":"commandAddTask",
					  "TaskName":$('#edit_div_content_title').val(),
					  "TaskDescription":$('#edit_div_content_content').val(),
					  "Priority":$('#edit_div_content_priority').val(),
					  "Tag":$('#edit_div_content_tag').val(),
					  "StateID":1,
					  "ProjectID":ProjectID,
					  "TaskOwnerIndex":"Tasks",
					  "Encrypt":(typeof curr_key=="undefined")?"":curr_key,
					  "Date":new Date()
				},function (data) {
					console.log(data);
					$('#div_todo').append("<div id=\"div_task_id_"+data+"\"class=\"portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all\"><div class=\"portlet-header ui-sortable-handle ui-widget-header ui-corner-all\">"+$('#edit_div_content_title').val()+"</div><div class=\"portlet-tag\">"+$('#edit_div_content_tag').val()+"</div><div class=\"portlet-content\">"+p2div($('#edit_div_content_content').val())+"</div></div>");
					tasks_set[data] = {
						  "TaskName":$('#edit_div_content_title').val(),
						  "TaskDescription":$('#edit_div_content_content').val(),
						  "Tag":$('#edit_div_content_tag').val(),
						  "priority":$('#edit_div_content_priority').val()
						  
					}
					$('#div_task_id_'+data).click(
						  {param:data},
							function(e){
							  task_id_to_edit = e.data.param;
							  $('#edit_div_content_title').val(tasks_set[task_id_to_edit].TaskName);
							  $('#edit_div_content_content').val(tasks_set[task_id_to_edit].TaskDescription);
							  $('#edit_div_content_tag').val(tasks_set[task_id_to_edit].tag);
							  $('#edit_div_content_priority').val(tasks_set[task_id_to_edit].priority);
							  $('#edit_div').show();
							  $('#edit_div').attr('add_or_edit','edit');
							}
					);

				}
			);

			break;
		case 'edit':
			tasks_set[task_id_to_edit].TaskName = $('#edit_div_content_title').val();
			tasks_set[task_id_to_edit].TaskDescription = $('#edit_div_content_content').val();
			var priority_input_text = $('#edit_div_content_priority').val();
			tasks_set[task_id_to_edit].priority = (isNaN(parseInt(priority_input_text)))?0:parseInt(priority_input_text);
			tasks_set[task_id_to_edit].Tag = $('#edit_div_content_tag').val();
			$('#div_task_id_'+task_id_to_edit+' .portlet-header').html(tasks_set[task_id_to_edit].TaskName);
			$('#div_task_id_'+task_id_to_edit+' .portlet-content').html(p2div(tasks_set[task_id_to_edit].TaskDescription));
			$('#div_task_id_'+task_id_to_edit+' .portlet-tag').html(tasks_set[task_id_to_edit].Tag);
			//tasks_set[task_id_to_edit].TaskName = $('#edit_div_content_title').text();
			//tasks_set[task_id_to_edit].TaskDescription = $('#edit_div_content_content').text();
			//tasks_set[task_id_to_edit].priority = $('#edit_div_content_priority').text();

			$.get(
				appScrum,{
					  "command":"commandEditTask",
					  "TaskID":task_id_to_edit,
					  "TaskName":tasks_set[task_id_to_edit].TaskName,
					  "TaskDescription":tasks_set[task_id_to_edit].TaskDescription,
					  "Priority":tasks_set[task_id_to_edit].priority,
					  "StateID":tasks_set[task_id_to_edit].StateID,
					  "ProjectID":ProjectID,
					  "Tag":tasks_set[task_id_to_edit].Tag,
					  "TaskOwnerIndex":"Tasks"
				},function (data) {

				}
			);
		    $('#edit_div_content_title').val("");
			$('#edit_div_content_content').val("");
			$('#edit_div_content_tag').val("");
			$('#edit_div_content_priority').val("");

			break;
	}

 }

 var DeleteTask = function(){
	 $.get(
				appScrum,{
					  "command":"commandDeleteTask",
					  "TaskID":task_id_to_edit,
					  "TaskOwnerIndex":"Tasks"
				},function (data) {
					$('#div_task_id_'+task_id_to_edit).remove()
				}
			);
 }

 var TaskToEdit;


 var load = function(private_key_input){
	//console.log(private_key_input);

   	$('#div_history').hide();

   	 if(window.location.search == ""){

   	}else{
   		var location_search = window.location.search.split("?")[1];
   		var query=location_search.split("&")[0];
   		ProjectID = query.split("=")[1];
   		query = location_search.split("&")[1];
   		ProjectName = query.split("=")[1];
		document.title= 'Scrum ('+ProjectName+')';
   		$('#ProjectTitle').text(ProjectName);
   	}

   	$('#edit_div').hide();
        $( ".column" ).sortable({
		connectWith: ".column",
		handle: ".portlet-header",
		cancel: ".portlet-toggle",
		placeholder: "portlet-placeholder ui-corner-all",
		stop: function(event, ui){
			var tmp = ui.item.attr('id');
			var TaskToMoved = $('#'+tmp).attr("id");
			//console.log(TaskToMoved);
			var TaskIDToMoved = TaskToMoved.split('_').pop();
			var DivMovedTo = $('#'+tmp).parent().attr("id");
			//console.log(DivMovedTo);
			var StateIDMovedTo;

			switch(DivMovedTo){
			  case "div_todo":
					StateIDMovedTo = 1;
					break;
			  case "div_ongoing":
					StateIDMovedTo = 2;
					break;
			  case "div_done":
					StateIDMovedTo = 3;
					break;
			  case "div_history":
					StateIDMovedTo = 4;
					break;
			}
			tasks_set[TaskIDToMoved].StateID = StateIDMovedTo;
			//console.log(tasks_set[TaskIDToMoved]);
			//console.log(tasks_set[TaskIDToMoved].priority);
			$.get(
				appScrum,{
					  "command":"commandEditTask",
					  "TaskID":TaskIDToMoved,
					  "TaskName":tasks_set[TaskIDToMoved].TaskName,
					  "TaskDescription":tasks_set[TaskIDToMoved].TaskDescription,
					  "Priority":tasks_set[TaskIDToMoved].priority,
					  "StateID":StateIDMovedTo,
					  "ProjectID":ProjectID,
					  "TaskOwnerIndex":"Tasks",
					  "Tag": tasks_set[TaskIDToMoved].Tag
				},function (data) {

				}
			);


		}										
       });

       $( ".portlet" )
         .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
         .find( ".portlet-header" )
           .addClass( "ui-widget-header ui-corner-all" )


       $( ".portlet-toggle" ).click(function() {

         var icon = $( this );
         icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
         icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
       });

   	$('.portlet').click(function(){

   		//$(this).remove();
   		//console.log($(this).id);
   	});
    //console.log(private_key_input);
   	$.get(
   		appScrum,{
   			"command":"commandGetTasks",
   			"ProjectID":ProjectID,
			"TaskOwnerIndex":"Tasks",
			"Encrypt":private_key_input
   		},function (data) {
   			console.log(data);
   			var tasks_set_tmp = data.split('||');
   			tasks_set_tmp.pop();
   			//console.log(tasks_set_tmp);
   			for(var itask=0;itask<tasks_set_tmp.length;itask++){
   				var TaskID = tasks_set_tmp[itask].split('$$')[0];
   				var TaskName = tasks_set_tmp[itask].split('$$')[1];
   				var TaskDescription = tasks_set_tmp[itask].split('$$')[2];
				//console.log(TaskDescription);
   				var priority = tasks_set_tmp[itask].split('$$')[3];
   				var StateID = parseInt(tasks_set_tmp[itask].split('$$')[4]);
				var Tag = tasks_set_tmp[itask].split('$$')[5];
				var EstablishDate = tasks_set_tmp[itask].split('$$')[6];
				//console.log(EstablishDate);
   				tasks_set[TaskID] = {
   					"TaskName":TaskName,
   					"TaskDescription":TaskDescription,
   					"priority":priority,
   					"StateID":StateID,
   					"ProjectID":ProjectID,
					"Tag":Tag,
					"Date":EstablishDate
   				}
				//console.log(Tag);
				//console.log(tasks_set[TaskID].Tag);
   				switch(StateID){
   					case STATETODO:
						console.log(EstablishDate);
						var establish_date = new Date(EstablishDate);
						var curr_date = new Date();
						var timeDiff = Math.abs(curr_date.getTime() - establish_date.getTime());
						var diffDays = (timeDiff / (1000 * 3600 * 24)).toFixed(2); 
						//console.log(diffDays);
   						$('#div_todo').append("<div id=\"div_task_id_"+TaskID+"\"class=\"portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all\"><div class=\"portlet-header ui-sortable-handle ui-widget-header ui-corner-all\">"+TaskName+"("+ diffDays +"D)</div><div class=\"portlet-tag\">"+Tag+"</div><div class=\"portlet-content\">"+p2div(TaskDescription)+"</div></div>");
   						$('#div_task_id_'+TaskID).click(
   						{param:TaskID},
   							function(e){
								
   								task_id_to_edit = e.data.param;
   								$('#edit_div_content_title').val(tasks_set[e.data.param].TaskName);
   								$('#edit_div_content_content').val(tasks_set[e.data.param].TaskDescription);
								$('#edit_div_content_tag').val(tasks_set[e.data.param].Tag);
   								$('#edit_div_content_priority').val(tasks_set[e.data.param].priority);
   								$('#edit_div').show();
   								$('#edit_div').attr('add_or_edit','edit');
   							}
   						);
   						break;
   					case STATEONGOING:

   						$('#div_ongoing').append("<div id=\"div_task_id_"+TaskID+"\"class=\"portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all\"><div class=\"portlet-header ui-sortable-handle ui-widget-header ui-corner-all\">"+TaskName+"</div><div class=\"portlet-tag\">"+Tag+"</div><div class=\"portlet-content\">"+p2div(TaskDescription)+"</div></div>");
   						$('#div_task_id_'+TaskID).click(
   							{param:TaskID},
   							function(e){
   								task_id_to_edit = e.data.param;
   								$('#edit_div_content_title').val(tasks_set[e.data.param].TaskName);
   								$('#edit_div_content_content').val(tasks_set[e.data.param].TaskDescription);
								$('#edit_div_content_tag').val(tasks_set[e.data.param].Tag);
   								$('#edit_div_content_priority').val(tasks_set[e.data.param].priority);
   								$('#edit_div').show();
   								$('#edit_div').attr('add_or_edit','edit');
   							}
   						);
   						break;
   					case STATEDONE:

   						$('#div_done').append("<div id=\"div_task_id_"+TaskID+"\"class=\"portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all\"><div class=\"portlet-header ui-sortable-handle ui-widget-header ui-corner-all\">"+TaskName+"</div><div class=\"portlet-tag\">"+Tag+"</div><div class=\"portlet-content\">"+p2div(TaskDescription)+"</div></div>");
   						$('#div_task_id_'+TaskID).click(
   						{param:TaskID},
   							function(e){

   								task_id_to_edit = e.data.param;
   								$('#edit_div_content_title').val(tasks_set[e.data.param].TaskName);
   								$('#edit_div_content_content').val(tasks_set[e.data.param].TaskDescription);
								$('#edit_div_content_tag').val(tasks_set[e.data.param].Tag);
   								$('#edit_div_content_priority').val(tasks_set[e.data.param].priority);
   								$('#edit_div').show();
   								$('#edit_div').attr('add_or_edit','edit');
   							}
   						);
   						break;
   					case STATEHISTORY:
   						$('#div_history').append("<div id=\"div_task_id_"+TaskID+"\"class=\"portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all\"><div class=\"portlet-header ui-sortable-handle ui-widget-header ui-corner-all\">"+TaskName+"</div><div class=\"portlet-tag\">"+Tag+"</div><div class=\"portlet-content\">"+p2div(TaskDescription)+"</div></div>");
   						$('#div_task_id_'+TaskID).click(
   						{param:TaskID},
   							function(e){
   								task_id_to_edit = e.data.param;
   								$('#edit_div_content_title').val(tasks_set[e.data.param].TaskName);
   								$('#edit_div_content_content').val(tasks_set[e.data.param].TaskDescription);
								$('#edit_div_content_tag').val(tasks_set[e.data.param].Tag);
   								$('#edit_div_content_priority').val(tasks_set[e.data.param].priority);
   								$('#edit_div').show();
   								$('#edit_div').attr('add_or_edit','edit');
   							}
   						);
   						break;
   				}
   			}

   		}
   	)


 }

 $(function() {
   $('#div_authen_send').click(function(){
     $.get(
     appAuthen,{
       "command":"commandAskPass",
       "UserName":$('#div_authen_UserName').text(),
       "Q1Answer":$('#div_authen_Q1Answer').text(),
       "Q2Answer":$('#div_authen_Q2Answer').text(),
       "ProjectID":ProjectID
     },function (data) {
       //console.log(data);

          if(data!="false"){
            $('#div_authen').hide();
            load(data);
            curr_key = data;
          }else{//false
            //console.log('false');
            $('#div_authen_info').text('authentication failed');
          }
     });

   });

   var location_search = window.location.search.split("?")[1];
   var query=location_search.split("&")[0];
   var ProjectID = query.split("=")[1];
   var query = location_search.split("&")[2];
   var is_public = query.split("=")[1];
   //console.log(is_public);
   if(is_public == "true"){
     $('#div_authen').hide();
     $.get(
     appAuthen,{
       "command":"commandAskPass",
       "ProjectID":ProjectID
     },function (data) {
          
		  if(data){
			load(data);
            curr_key = data;
          }else{
			load(data);

          }
     });
   }



  }


  );
