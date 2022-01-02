<?php

$nomSociete = $_REQUEST['data']['nomSociete'];
$rootDir = $_REQUEST['data']['rootDir'];

$json = file_get_contents('build.json');
$folders = json_decode($json);

function buildDirs($folders, $path = null) {
    $path = $path == null ? "" : $path . "/";

    foreach ($folders as $key => $val) {
        mkdir($path . $val->name, 0777, true);
        //echo "Folder: " . $path . $val->name . "<br>";

        if (!empty($val->files)) {
            foreach ($val->files as $file) {
                //Create the files inside the current folder $val->name
                //echo "File: " . $path . $val->name . "/" . $file->name . "<br>";
                file_put_contents($path . $val->name . "/" . $file->name, "your data");
            }
        }

        if (!empty($val->folders)) { //If there are any sub folders, call buildDirs again!
            buildDirs($val->folders, $path . $val->name);
        }
    }
}

$structure = $_SERVER['DOCUMENT_ROOT'] . $rootDir.'companies/' . $nomSociete;
buildDirs($folders->folders, $structure); //Will build from current directory, otherwise send the path without trailing slash /var/www/here

