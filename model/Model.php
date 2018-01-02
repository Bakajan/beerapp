<?php
    $CONFIG = include('../config.php');

    Class Model {
        public $TYPE;
        public $FORMAT = 'json';
        public $ENDPOINT = 'search';
        public $ARGS = [];
        public $URL;
        public static $test;

        public function __construct () {
            global $CONFIG;
            $this->ARGS = [
                "key" => $CONFIG['apikey'],
                "format" => $this->FORMAT,
            ];
            $this->URL = $CONFIG['baseurl'] . $CONFIG['version'];
        }

        public function call ($url) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_URL, $url);
            
            
            if(curl_exec($ch) === false)
                curl_error($ch);
            
            if($errno = curl_errno($ch))
                return curl_strerror($errno);
      
            $results = curl_exec($ch);
            curl_close($ch);
             
            return $results;
        }

        public function toBoolean ($value) {
            if($value === 'true')
                return 1;
            else if ($value === 'false')
                return 0;
            else
                return $value;
        }
    }
?>