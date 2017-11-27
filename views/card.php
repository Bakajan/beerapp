<?php
    Class Card extends View {
        const PATH = 'templates/card.php';

        public function render() {
            $template = $this->getView($this::PATH);
            $compressed = preg_replace( "/\r|\n/", "", $template );
            $compressed = addslashes($compressed);

            return $compressed;
        }
    }
?>