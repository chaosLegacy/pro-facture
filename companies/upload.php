<?php

if (!empty($_FILES)) {

    $id = $_REQUEST['id'];
    $societe = $_REQUEST['societe'];
    $section = $_REQUEST['section'];

    if (isset($id) && isset($societe) && isset($section)) {
        
        $tempPath = $_FILES['file']['tmp_name'];
        $uploadPath = dirname(__FILE__) . DIRECTORY_SEPARATOR . $societe . DIRECTORY_SEPARATOR . $section . DIRECTORY_SEPARATOR . $id . $_FILES['file']['name'];
        move_uploaded_file($tempPath, $uploadPath);

        $answer = array('answer' => 'File transfer completed');
        $json = json_encode($answer);

        echo $json;
        
    } else {
        
        echo 'No path found';
        
    }
    
} else {

    echo 'No files';
}
/*
  if ( !empty( $_FILES ) ) {

  $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
  $uploadPath = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];

  move_uploaded_file( $tempPath, $uploadPath );

  $answer = array( 'answer' => 'File transfer completed' );
  $json = json_encode( $answer );

  echo $json;

  } else {

  echo 'No files';

  }
 */
?>