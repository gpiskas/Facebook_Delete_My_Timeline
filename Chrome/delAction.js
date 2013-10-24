/*
*  Facebook - Delete My Timeline
*  Copyright (C) 2013  George Piskas
*
*  This program is free software; you can redistribute it and/or modify
*  it under the terms of the GNU General Public License as published by
*  the Free Software Foundation; either version 2 of the License, or
*  (at your option) any later version.
*
*  This program is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU General Public License for more details.
*
*  You should have received a copy of the GNU General Public License along
*  with this program; if not, write to the Free Software Foundation, Inc.,
*  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*
*  Contact: geopiskas@gmail.com
*/

function deleteAll() {
				
    if (confirm("Are you sure you wish to proceed?")) {
	
        var postList = document.getElementsByClassName('_dxs _p');
		var ignoreCount = 0;
		var free = true;
		
		if (postList.length == 0) {
            alert('No posts to delete!\nYour timeline is already empty.\n\nIf not, contact the developer at geopiskas@gmail.com'); 
        } else {
			// Wait for mutex
			var waitMutex = setInterval(function() {
			if (postList.length == ignoreCount) {
				clearInterval(waitMutex);
				if (ignoreCount == 0) {
					alert('All visible posts have been deleted!\n\nIf not, contact the developer at geopiskas@gmail.com'); 
				} else {
					alert('All visible posts have been deleted but ' + ignoreCount + ' post(s) could not be deleted due to facebook limitations!\n\nIf nothing was deleted, contact the developer at geopiskas@gmail.com'); 
				}
			} else if (free == true) {
				free = false;
				deletePost();
			}}, 100);
		}
		
        function deletePost() {
			// Open menu and find delete or hide buttons
			postList[ignoreCount].click();
			var waitMenu = setInterval(function() {
				if (document.querySelectorAll('.uiContextualLayerPositioner.uiLayer:not(.hidden_elem)').length>0 && document.querySelectorAll('.uiContextualLayerPositioner.uiLayer:not(.hidden_elem)')[0].getElementsByTagName('a').length > 0) {
					clearInterval(waitMenu);
					
					var delIndex = -1;
					var hideIndex = -1;
					var buttons = document.querySelectorAll('.uiContextualLayerPositioner.uiLayer:not(.hidden_elem)')[0].getElementsByTagName('a');
					for (var i=0;i<buttons.length;i++) {
						var ajaxify = buttons[i].getAttribute("ajaxify");
						if (ajaxify.indexOf("remove_content") > -1) {
							delIndex = i;
							break;
						}
						if (ajaxify.indexOf("customize_action=2") > -1) {
							hideIndex = i;
						}
					}
			
					// do stuff
					if (delIndex > -1) {
						var postCount = postList.length - ignoreCount;	
						// Wait for del dialogue and click
						buttons[delIndex].click();
						var waitDel = setInterval(function() {
						if (document.getElementsByClassName('uiButtonConfirm').length > 0) {
							clearInterval(waitDel);
							// Wait for post gone and free mutex
							document.getElementsByClassName('uiButtonConfirm')[0].click();
							var waitGone = setInterval(function() {
							if (postCount > postList.length - ignoreCount) {
								clearInterval(waitGone);
								free = true;
							}}, 100);
						}}, 100);
						
					} else if (hideIndex > -1) {
						buttons[hideIndex].click();
						var waitHide = setInterval(function() {
						if (document.getElementsByClassName('fbTimelineColumnHidden').length>0) {
							clearInterval(waitHide);
						    free = true;
						}}, 100);
					} else {
						ignoreCount+=1;
						free = true;
					}
			
			}}, 100);
        }
		
    }
}

if (document.getElementById('activityLogButton')!=null) {
	deleteAll();
} else {
	alert('Please navigate to your profile page first!'); 
}
