<?
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true ");
header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");


$link = mysqli_connect("localhost", "", "");
mysqli_select_db($link, 'pong');

if (mysqli_connect_errno())
{
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

// check for data
if($_GET)
{
	print_r($_GET);

	$player = mysqli_real_escape_string($link, $_GET['player']);
	$score  = mysqli_real_escape_string($link, (isset($_GET['score'])) ? $_GET['score'] : NULL);

	$date   = time();

	if($score == NULL)
	{
		$query = "INSERT INTO games (player, date) VALUES ('$player', '$date')";
	}
	else
	{
		$query  = "UPDATE games SET score='$score' AND date='$date' WHERE player='$player'"; 
	}


	mysqli_query($link, $query)or die('error:'.mysqli_error());
}
