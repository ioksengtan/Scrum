var appProjects = "https://script.google.com/macros/s/AKfycbyVFbotuFOaQRwQ2bZK-JWS1GWLOlxd_5DjV4P3PhR_ktnI6Dsv/exec";

var projects_set = {};
var project_id_to_edit;
var EditProject = function(ProjectID){
		console.log(ProjectID);
		$('#edit_div').attr('add_or_edit','edit');
		$('#edit_div_content_title').text(projects_set[ProjectID].ProjectName);
		$('#edit_div_content_content').text(projects_set[ProjectID].ProjectDescription);
		$('#edit_div_content_authen').text(projects_set[ProjectID].ProjectAuthen);
		project_id_to_edit = ProjectID;
		$('#edit_div').show();
}
 var ToAddProject = function(){


	 $('#edit_div').show();
	 $('#edit_div').attr('add_or_edit','add');
 }
var SaveProject = function(){
	switch($('#edit_div').attr('add_or_edit')){
		case 'add':
				$.get(
						appProjects,{
							  "command":"commandAddProject",
							  "ProjectName":$('#edit_div_content_title').text(),
							  "ProjectDescription":$('#edit_div_content_content').text(),
							  "OwnerID":$('#edit_div_content_authen').text(),
						},function (data) {
							var authen_text = ($('#edit_div_content_authen').text()==0)?"public":"private";
							$('.table').append("    <div id=\"div_project_id_"+data+"\" class=\"row\"><div class=\"cell\"><a href=\"scrum.html?ProjectID="+data+"&amp;ProjectName="+$('#edit_div_content_title').text()+"&amp;Public="+authen_text+"\" target=\"_blank\">"+$('#edit_div_content_title').text()+"</a></div><div class=\"cell\">"+$('#edit_div_content_content').text()+"</div><div class=\"cell\">"+authen_text+"</div><div class=\"cell\"><a href=\"javascript:EditProject("+data+")\">Edit</a></div></div>")
							projects_set[data] = {
								"ProjectName":$('#edit_div_content_title').text(),
								"ProjectDescription":$('#edit_div_content_content').text(),
								"ProjectAuthen":authen_text								
								
							}
						}
				);
				break;
		case 'edit':
				$.get(
						appProjects,{
							  "command":"commandEditProject",
							  "ProjectID":project_id_to_edit,
							  "ProjectName":$('#edit_div_content_title').text(),
							  "ProjectDescription":$('#edit_div_content_content').text(),
							  "OwnerID":$('#edit_div_content_authen').text(),
						},function (data) {
							//$('#div_project_id_10').children().text()
						
						}
				);
				break;
	}
}

var DeleteProject = function(){
	$.get(
   			appProjects,{
				  "command":"commandDeleteProject",
				  "ProjectID":project_id_to_edit
   			},function (data) {
				console.log(project_id_to_edit);
				delete projects_set[project_id_to_edit];
				$('#div_project_id_'+project_id_to_edit).remove();
			}
	);	
}

$(function() {
	   		$.get(
   			appProjects,{
				"command":"commandGetProjects"
   			},function (data) {
				console.log(data);
				var project_set_tmp = data.split('||');
				project_set_tmp.pop();
				for(var iproject=0;iproject<project_set_tmp.length;iproject++){
					var project_tmp = project_set_tmp[iproject];
					var ProjectID = project_tmp.split('$$')[0];
					var ProjectName = project_tmp.split('$$')[1];
					var ProjectDescription = project_tmp.split('$$')[2];
					var ProjectAuthen = project_tmp.split('$$')[3];
					projects_set[ProjectID] = {
						"ProjectName":ProjectName,
						"ProjectDescription":ProjectDescription,
						"ProjectAuthen":ProjectAuthen
					}
					var public_text = (ProjectAuthen=="public")?"true":"false";
					$('.table').append("    <div class=\"row\" id=\"div_project_id_"+ProjectID+"\"><div class=\"cell\"><a href=\"scrum.html?ProjectID="+ProjectID+"&amp;ProjectName="+ProjectName+"&amp;Public="+public_text+"\" target=\"_blank\">"+ProjectName+"</a></div><div class=\"cell\">"+ProjectDescription+"</div><div class=\"cell\">"+ProjectAuthen+"</div><div class=\"cell\"><a href=\"javascript:EditProject("+ProjectID+")\">Edit</a></div></div>")
				}
			}
   		);
});