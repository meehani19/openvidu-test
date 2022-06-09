import $ from 'jquery';

export function joinSession(id) {
    document.getElementById("join-btn").disabled = true;
    document.getElementById("join-btn").innerHTML = "Joining...";
}

function getToken(callback) {
    sessionName = $("#sessionName").val()
}