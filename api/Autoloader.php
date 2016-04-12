<?php

class Autoloader {

    static function autoload($className) {
        require "Entity/" . $className . ".php";
    }

}
