<?php

class FileService {
    static function read($filename){
        try {
            $fileObject = fopen($filename, 'r');
            if (!$fileObject) {
                throw new Exception("File could not be opened.");
            }

            $fileContents = fread($fileObject, filesize($filename));
            if (filesize($filename) <= 3) {
                throw new Exception;
            }

            return $fileContents;
            
        } catch (Exception $exc) {
            trigger_error($exc->getMessage(), E_USER_NOTICE);

        } finally {
            fclose($fileObject);
        }
    } 
}

?>