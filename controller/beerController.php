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
                            echo json_encode(['type' => 'failure', 'message' => 'Empty vars']);
                        else
                            echo $this->BEER->update($beer);
                    }
                    else if($_POST['action'] == 'mine') {
                        header('Content-type: application/json');
                        echo $this->BEER->get_mine();
                    }
                    else if($_POST['action'] == 'delete') {
                        $beer_id = isset($_POST['beerID']) ? $_POST['beerID'] : '';

                        header('Content-type: application/json');
                        if(empty($beer_id))
                            echo json_encode(['type' => 'failure', 'message' => 'Empty vars']);
                        else
                            echo json_encode($this->BEER->delete($beer_id));
                    }
                }
            }
        }
    }
    
    $beer_controller = new beerController();
?> 