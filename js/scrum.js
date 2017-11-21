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
					  "TaskName":$('#edit_div_content_title').text(),
					  "TaskDescription":$('#edit_div_content_content').text(),
					  "Priority":$('#edit_div_content_priority').text(),
					  "StateID":1,
					  "ProjectID":ProjectID,
					  "TaskOwnerIndex":curr_key
				},function (data) {
					$('#div_todo').append("<div id=\"div_task_id_"+data+"\"class=\"portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all\"><div class=\"portlet-header ui-sortable-handle ui-widget-header ui-corner-all\">"+$('#edit_div_content_title').text()+"</div><div class=\"portlet-content\">"+$('#edit_div_content_content').text()+"</div></div>");

          $('#div_task_id_'+data).click(
          {param:data},
            function(e){
              task_id_to_edit = e.data.param;
              console.log(task_id_to_edit);
              tasks_set[task_id_to_edit].TaskName = $('#edit_div_content_title').text();
              tasks_set[task_id_to_edit].TaskDescription = $('#edit_div_content_content').text();
              tasks_set[task_id_to_edit].Priority = $('#edit_div_content_priority').text();

              $('#edit_div_content_title').text(tasks_set[task_id_to_edit].TaskName);
              $('#edit_div_content_content').text(tasks_set[task_id_to_edit].TaskDescription);
              $('#edit_div_content_priority').text(tasks_set[task_id_to_edit].priority);
              $('#edit_div').show();
              $('#edit_div').attr('add_or_edit','edit');
            }
          );

				}
			);
			break;
		case 'edit':
			tasks_set[task_id_to_edit].TaskName = $('#edit_div_content_title').text();
			tasks_set[task_id_to_edit].TaskDescription = $('#edit_div_content_content').text();
			tasks_set[task_id_to_edit].priority = $('#edit_div_content_priority').text();

			$('#div_task_id_'+task_id_to_edit+' .portlet-header').html(tasks_set[task_id_to_edit].TaskName);
			$('#div_task_id_'+task_id_to_edit+' .portlet-content').html(tasks_set[task_id_to_edit].TaskDescription);
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
            "TaskOwnerIndex":curr_key
				},function (data) {

				}
			);
		    $('#edit_div_content_title').text("");
			$('#edit_div_content_content').text("");
			$('#edit_div_content_priority').text("");

			break;
	}

 }

 var DeleteTask = function(){
	 $.get(
				appScrum,{
					  "command":"commandDeleteTask",
					  "TaskID":task_id_to_edit,
            "TaskOwnerIndex":curr_key
				},function (data) {
					$('#div_task_id_'+task_id_to_edit).remove()
				}
			);
 }

 var TaskToEdit;

 //var private_key = "45BCSFDLXJ"

 var load = function(private_key_input){


   	$('#div_history').hide();

   	 if(window.location.search == ""){

   	}else{
   		var location_search = window.location.search.split("?")[1];
   		var query=location_search.split("&")[0];
   		ProjectID = query.split("=")[1];
   		query = location_search.split("&")[1];
   		ProjectName = query.split("=")[1];
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
   		  console.log(TaskToMoved);
   		  var TaskIDToMoved = TaskToMoved.split('_').pop();
   		  var DivMovedTo = $('#'+tmp).parent().attr("id");
   		  console.log(DivMovedTo);
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
   		$.get(
   			appScrum,{
   				  "command":"commandEditTask",
   				  "TaskID":TaskIDToMoved,
   				  "TaskName":tasks_set[TaskIDToMoved].TaskName,
   				  "TaskDescription":tasks_set[TaskIDToMoved].TaskDescription,
   				  "Priority":tasks_set[TaskIDToMoved].priority,
   				  "StateID":StateIDMovedTo,
   				  "ProjectID":tasks_set[TaskIDToMoved].ProjectID,
            "TaskOwnerIndex":private_key_input
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
         "TaskOwnerIndex":private_key_input
   		},function (data) {
   			//console.log(data);
   			var tasks_set_tmp = data.split('|');
   			tasks_set_tmp.pop();
   			//console.log(tasks_set_tmp);
   			for(var itask=0;itask<tasks_set_tmp.length;itask++){
   				var TaskID = tasks_set_tmp[itask].split(',')[0];
   				var TaskName = tasks_set_tmp[itask].split(',')[1];
   				var TaskDescription = tasks_set_tmp[itask].split(',')[2];
   				var priority = tasks_set_tmp[itask].split(',')[3];
   				var StateID = parseInt(tasks_set_tmp[itask].split(',')[4]);

   				tasks_set[TaskID] = {
   					"TaskName":TaskName,
   					"TaskDescription":TaskDescription,
   					"priority":priority,
   					"StateID":StateID,
   					"ProjectID":ProjectID
   				}

   				switch(StateID){
   					case STATETODO:

   						$('#div_todo').append("<div id=\"div_task_id_"+TaskID+"\"class=\"portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all\"><div class=\"portlet-header ui-sortable-handle ui-widget-header ui-corner-all\">"+TaskName+"</div><div class=\"portlet-content\">"+TaskDescription+"</div></div>");
   						$('#div_task_id_'+TaskID).click(
   						{param:TaskID},
   							function(e){
   								task_id_to_edit = e.data.param;
   								$('#edit_div_content_title').text(tasks_set[e.data.param].TaskName);
   								$('#edit_div_content_content').text(tasks_set[e.data.param].TaskDescription);
   								$('#edit_div_content_priority').text(tasks_set[e.data.param].priority);
   								$('#edit_div').show();
   								$('#edit_div').attr('add_or_edit','edit');
   							}
   						);
   						break;
   					case STATEONGOING:

   						$('#div_ongoing').append("<div id=\"div_task_id_"+TaskID+"\"class=\"portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all\"><div class=\"portlet-header ui-sortable-handle ui-widget-header ui-corner-all\">"+TaskName+"</div><div class=\"portlet-content\">"+TaskDescription+"</div></div>");
   						$('#div_task_id_'+TaskID).click(
   							{param:TaskID},
   							function(e){
   								task_id_to_edit = e.data.param;
   								$('#edit_div_content_title').text(tasks_set[e.data.param].TaskName);
   								$('#edit_div_content_content').text(tasks_set[e.data.param].TaskDescription);
   								$('#edit_div_content_priority').text(tasks_set[e.data.param].priority);
   								$('#edit_div').show();
   								$('#edit_div').attr('add_or_edit','edit');
   							}
   						);
   						break;
   					case STATEDONE:

   						$('#div_done').append("<div id=\"div_task_id_"+TaskID+"\"class=\"portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all\"><div class=\"portlet-header ui-sortable-handle ui-widget-header ui-corner-all\">"+TaskName+"</div><div class=\"portlet-content\">"+TaskDescription+"</div></div>");
   						$('#div_task_id_'+TaskID).click(
   						{param:TaskID},
   							function(e){

   								task_id_to_edit = e.data.param;
   								$('#edit_div_content_title').text(tasks_set[e.data.param].TaskName);
   								$('#edit_div_content_content').text(tasks_set[e.data.param].TaskDescription);
   								$('#edit_div_content_priority').text(tasks_set[e.data.param].priority);
   								$('#edit_div').show();
   								$('#edit_div').attr('add_or_edit','edit');
   							}
   						);
   						break;
   					case STATEHISTORY:
   						$('#div_history').append("<div id=\"div_task_id_"+TaskID+"\"class=\"portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all\"><div class=\"portlet-header ui-sortable-handle ui-widget-header ui-corner-all\">"+TaskName+"</div><div class=\"portlet-content\">"+TaskDescription+"</div></div>");
   						$('#div_task_id_'+TaskID).click(
   						{param:TaskID},
   							function(e){
   								task_id_to_edit = e.data.param;
   								$('#edit_div_content_title').text(tasks_set[e.data.param].TaskName);
   								$('#edit_div_content_content').text(tasks_set[e.data.param].TaskDescription);
   								$('#edit_div_content_priority').text(tasks_set[e.data.param].priority);
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

          }
     });
   }



  }


  );
