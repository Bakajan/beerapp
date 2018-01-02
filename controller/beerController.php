<?php
    include("../model/beer.php");

    Class beerController
    {
        private $BEER;

        public function __construct () {
            $this->BEER = new beer();
            
            if(isset($_POST)) {
                if(isset($_POST['action'])) {
                    if($_POST['action'] == 'beers') {
                        $term = isset($_POST['term']) ? $_POST['term'] : '';
                        
                        echo $this->BEER->find($term);
                    }
                    else if($_POST['action'] == 'edit') {
                        $beer = isset($_POST['beer']) ? $_POST['beer'] : '';

                        if(empty($beer))
                            echo json_encode(['status' => 'failure', 'error' => 'Empty vars']);
                        else
                            echo $this->BEER->update($beer);
                    }
                    else if($_POST['action'] == 'mine') {
	                    header('Content-type: application/json');
                        echo $this->BEER->get_mine();
                    }
                }
            }
        }
    }
    
    $beer_controller = new beerController();
?> 