<?PHP
$data = json_decode($_POST['data'], true);
if (array_key_exists('view', $data)) {
    $view = $data['view'];
}
if (array_key_exists('updateGlobalData', $data)) {
    $updateGlobalData = $data['updateGlobalData'];
}
if (array_key_exists('updateBackgroundData', $data)) {
    $updateBackgroundData = $data['updateBackgroundData'];
}
if (array_key_exists('ikariam_model', $data)) {
    $ikariam_model = $data['ikariam_model'];
}
//
// file_put_contents("./ikariam.model.js", $array);
// echo $_POST['data'];
// header('Content-Type: text/JSON; charset=UTF-8');
header("Content-Type: application/json; charset=UTF-8");
?>
<?= '{ "status": "success" }';
