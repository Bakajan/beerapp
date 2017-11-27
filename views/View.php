<?php
    Class View {
        const DIR = 'views';

        public function __constructor () {}

        public function getView ($view) {
            $file = file_get_contents($this::DIR . '/' . $view);

            return $file;
        }
    }
?>