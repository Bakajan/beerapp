<?php
    include("Model.php");
    $CONFIGS = include('../config.php');
    include( $CONFIGS['root'] . '/' . 'global_connector.php');

    Class Beer extends Model {
        const METHODS = [
          "get" => "GET",
          "post" => "POST",
          "put" => "PUT",
          "delete" => "DELETE"
        ];

        public function __construct () {
            parent::__construct();

            $this->TYPE = 'beer';
            $this->ARGS["type"] = $this->TYPE;
            $this->ARGS["withBreweries"] = "Y";
            $this->ARGS['q'] = '';
        }

        public function get_mine () {
            /// Connect to db
            $connection = new Connecter("beers");
            $sql ="SELECT * FROM beers";
            $stmt = $connection->conn->prepare($sql);
            try {
                $stmt->execute();
                $results  = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            catch(PDOException $e){
                return json_encode($e);
            }
            
            $connection->conn = null;
            $connection = null;

            echo json_encode($results);
        }

        public function insert ($beer, $fields) {
            /// Connect to db
            $connection = new Connecter("beers");
            /// Add email and name to mailing list
            $sql ="Insert INTO beers (beer_id , tried, rating, impression) VALUES (:beer, :tried, :rating, :impression)";
            $stmt = $connection->conn->prepare($sql);
            try {
//                $results = $stmt->execute([
//                	':beer' => $beer,
//	                ':tried' => $tried,
//	                ':rating' => $rating,
//	                ':impression' => $impression
//                ]);
            }
            catch(PDOException $e) {
                echo json_encode($e);
            }
            
            $connection->conn = null;
            $connection = null;

            echo json_encode('');
        }

        public function find ($term) {
            $term = (isset($term)) ? $term : ' ';
            $this->ARGS['q'] = $term;
            $url =  $this->URL . $this->ENDPOINT . "/" . "?" . http_build_query($this->ARGS);

            return json_encode($this->call($url));
        }

        public function count ($beer) {
	        /// Connect to db
	        $connection = new Connecter();
	        /// Add email and name to mailing list
	        $sql ="SELECT 1 FROM beers WHERE beer_id = :beer";
	        $stmt = $connection->conn->prepare($sql);
	        try {
		        $results = $stmt->execute([':beer' => $beer['beer_id']]);
	        }
	        catch(PDOException $e) {
		        echo json_encode($e);
	        }

	        $connection->conn = null;
	        $connection = null;

	        return $stmt->fetchColumn();
        }

        public function update ($beer) {
            /// Connect to db
            $connection = new Connecter();
            $result = [
                'result' => 'Success',
                'errors' => []
            ];

        	if($this->count($beer)) { // if found one update beer //
		        $sql ="UPDATE beers ";
		        $sql .= "SET ";

		        $numItems = count(array_keys($beer));
		        $i = 0;
		        $pdo_Array = [];
		        foreach ($beer as $key => $value) {
		        	$pdo_key = ":" . $key;
			        $sql .= $key . '=' . $pdo_key;
			        if(++$i !== $numItems) {
				        $sql .= ', ';
			        }

			        $pdo_Array[$pdo_key] = $this->toBoolean($value);
		        }
		        $sql .= " WHERE beer_id = :beer_id";

		        $stmt = $connection->conn->prepare($sql);
		        try {
			        $results = $stmt->execute($pdo_Array);
		        }
		        catch(PDOException $e) {
                    $result['errors'][] = $e;
			        echo json_encode($e);
		        }

		        $connection->conn = null;
		        $connection = null;
	        }
	        else { // if not found add beer //
		        /// Connect to db
		        $connection = new Connecter();
		        /// Add email and name to mailing list
		        $sql  = "Insert INTO beers (beer_id, tried, rating, impression, icon, name, style, description, abv, date_submitted) 
							VALUES (:beer_id, :tried, :rating, :impression, :icon, :name, :style, :description, :abv, NOW())";
		        $stmt = $connection->conn->prepare( $sql );
		        try {
			        $results = $stmt->execute([
			        	":beer_id" => $beer['beer_id'],
			        	":tried" => $this->toBoolean($beer['tried']),
				        ":rating" => $beer['rating'],
				        ":impression" => $beer['impression'],
				        ":icon" => $beer['icon'],
				        ":name" => $beer['name'],
				        ":style" => $beer['style'],
				        ":description" => $beer['description'],
				        ":abv" => $beer['abv']
			        ]);
		        } catch ( PDOException $e ) {
                    $result['errors'][] = $e;
			        echo json_encode( $e );
		        }

		        $connection->conn = null;
		        $connection       = null;
	        }

	        if($results) {
        		$beer['tried'] = intval($beer['tried']);
		        $result['date_submitted'] = date( "Y-m-d H:i:s" );
		        $result['beer']           = $beer;
	        }

	        return json_encode($result, JSON_NUMERIC_CHECK);
        }

        public function findMine () {

        }
    }
?>
