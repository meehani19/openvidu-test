
function LogIn() {
    
    return(
        <div id="not-logged" >
			<form  onsubmit="return false">
				<p>
					<label>User</label><input type="text" id="user" required />
				</p>
				<p>
					<label>Pass</label><input type="password" id="pass" required />
				</p>
				<p >
					<button  onclick="logIn()">Log in</button>
				</p>
			</form>
			<table >
				<tr>
					<th>User</th>
					<th>Pass</th>
					<th>Role<i data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<div id='tooltip-div'>PUBLISHER<div>Send and receive media<hr></div>SUBSCRIBER<div>Receive media</div></div>"
						    class="glyphicon glyphicon-info-sign"></i></th>
				</tr>
				<tr>
					<td>publisher1</td>
					<td>pass</td>
					<td>PUBLISHER</td>
				</tr>
				<tr>
					<td>publisher2</td>
					<td>pass</td>
					<td>PUBLISHER</td>
				</tr>
				<tr>
					<td>subscriber</td>
					<td>pass</td>
					<td>SUBSCRIBER</td>
				</tr>
			</table>
		</div>
    )

}

export default LogIn;