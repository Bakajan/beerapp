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
	        $process = preg_replace( "/\{filters\}/", file_get_contents($this::DIR . '/' . "templates/filters.php"), $process );
	        $process = preg_replace( "/\{css\}/", file_get_contents($this::DIR . '/' . "css/main.css"), $process );
	        $process = preg_replace( "/\{beerview\}/", file_get_contents($this::DIR . '/' . "js/views/beerview.js"), $process );
	        $process = preg_replace( "/\{beermodel\}/", file_get_contents($this::DIR . '/' . "js/models/beer.js"), $process );
	        $process = preg_replace( "/\{model\}/", file_get_contents($this::DIR . '/' . "js/models/model.js"), $process );
	        $process = preg_replace( "/\{beercontroller\}/", file_get_contents($this::DIR . '/' . "js/controllers/beercontroller.js"), $process );
	        $process = preg_replace( "/\{popup\}/", file_get_contents($this::DIR . '/' . "partials/popup.html"), $process );
            $process = preg_replace( "/\r|\n/", "", $process );

            echo $process;
        }
    }
?>