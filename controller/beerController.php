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
                        $field = isset($_POST['field']) ? $_POST['field'] : '';
                        $value = isset($_POST['value']) ? $_POST['value'] : '';

                        if(empty($beer) || empty($field) || empty($value))
                            echo json_encode(['status' => 'failure', 'error' => 'Empty vars']);
                        else
                            echo $this->BEER->update($beer, $field, $value);
                    }
                    else if($_POST['action'] == 'mine') {
                        echo $this->BEER->get_mine();
                    }
                }
            }
        }
    }
    
    $beer_controller = new beerController();
?>