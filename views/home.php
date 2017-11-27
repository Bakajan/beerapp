<?php
    $card = include("views/card.php");
    Class Home extends View {
        const PATH = 'templates/home.php';

        public function render() {
            $template = $this->getView($this::PATH);

            $card = new Card();
            $templates = [
                [
                    "template" => $card->render(),
                    "variable" => "/\{cardtemplate\}/"
                ]
            ];

            foreach ($templates as $html) {
                $process = preg_replace( $html['variable'], $html['template'], $template );
            }
            $process = preg_replace( "/\{header\}/", file_get_contents($this::DIR . '/' . "templates/header.php"), $process );

            $process = preg_replace( "/\r|\n/", "", $process );

            echo $process;
        }
    }
?>