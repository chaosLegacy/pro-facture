<?php
header('Content-Disposition: inline');
header('Content-Type: application/pdf');
ob_start();

if (isset($_REQUEST['data'])) {
    foreach ($_REQUEST['data'] as $data) {
        if (isset($data['fournisseur'][0])) {
            $fournisseur = $data['fournisseur'][0];
        }
        if (isset($data['commande'][0])) {
            $commande = $data['commande'][0];
            $ListeElements = $commande['ListeElements'];
        }
        if (isset($data['societe'][0])) {
            $societe = $data['societe'][0];
        }
        if (isset($data['paramsPdf'][0])) {
            $paramsPdf = $data['paramsPdf'][0];
        }
        if (isset($data['currency'][0])) {
            $currency = $data['currency'][0];
        }
        if (isset($data['rootDir'][0])) {
            $rootDir = $data['rootDir'][0];
            require_once($_SERVER['DOCUMENT_ROOT'] . $rootDir.'vendor/modules/html2pdf/vendor/autoload.php');
        }
    }
    ?>
    <style type="text/css">
        *{color:<?= $paramsPdf['textcolor'];?>;}
        p{margin:0;padding:1mm 10mm;}
        hr{height:1.5pt;border:none;background:#CFD1D2;}
        table{border-collapse:collapse;width:100%;font-size:12pt;font-family:helvetica;line-height:6mm;}
        table strong{color:#000;}
        em{font-size:6pt;line-height:3mm;}
        td.right{text-align:right;}
        h1{margin:0;padding:4mm 0 0 0;}
        h2{margin:0;padding:0 4mm 0 0;}
        table.border td{border:1px solid #CFD1D2;padding:3mm 1mm;}
        table.border th,td.black{background:<?= $paramsPdf['tablecolor'];?>;color:#FFF;font-weight:bold;border:1px solid #FFF;padding:2mm 3mm;border-top:none;border-left:none;}
        td.noborder{border:none;}
        .footer{font-weight:normal;font-size:8pt;}
        .bsp{width:100px;padding:0 10%;}
    </style>

    <page backcolor="<?= $paramsPdf['backcolor'];?>" backtop="5mm" backleft="8mm" backright="8mm" backbottom="30mm" footer="page; date;">
        <page_footer>
            <hr/>
            <p>
            <h2 style="margin-top:-1mm;margin-bottom:4pt;">Bon de commande</h2>
            <span class="footer">
                Adresse:<?= $societe['adresse'] ?>,
    <?php
    if (!empty($$societe['tel']) || !empty($$societe['fax']))
        echo "Tel :" . $societe['tel'] . " / Fax : " . $societe['fax'] . "<br/>";
    ?>
                Direction général & administration :<?= $societe['nomSoc'] . " code postal : " . $societe['codePostal'] . ".<br/>" ?> 

    <?php if (true) { ?>
                    Capitale:<?= $societe['capitale']." ".$currency; ?>,
                <?php } ?>  
                <?php if (true) { ?>
                    Patente:<?= $societe['patente']; ?>
                <?php } ?>
            </span>
            </p>
            <br/><br/>
        </page_footer>
        <img src="<?= $_SERVER['DOCUMENT_ROOT'] . $rootDir. $societe['logo']; ?>" style="width:38mm;">
        <table style="vertical-align:top;">
            <tr>			
                <td style="width:60%;">
                    <strong>
    <?= $societe['nomSoc']; ?>
                    </strong><br/>

                    <strong>Patente:</strong><?= $societe['patente']; ?><br/>
                    <em>
                        Dispens&eacute; d'immatriculation au registre du commerce<br/>
                        et des soci&eacute;t&eacute;s (RCS) et au r&eacute;pertoire des m&eacute;tires (RM)
                    </em>
                </td>

                <td style="width:40%;" class="right">
                    <strong>N°fournisseur: <?= $fournisseur['reference'] ?></strong><br/>
                    <strong><?= $fournisseur['nom']; ?></strong><br/>
    <?php
    if (!empty($fournisseur['rue']) && !empty($fournisseur['ville']))
        echo $fournisseur['rue'] . " " . $fournisseur['ville'] . "<br/>" . $fournisseur['pays'] . " " . $fournisseur['codeP'] . "<br/>";
    ?>

                    <?php
                    if (!empty($fournisseur['tel']))
                        echo $fournisseur['tel'] . "<br/>";
                    ?>
                </td>
            </tr>
        </table>

        <table style="vertical-align:bottom;margin-top:20mm;">
            <tr>
                <td style="width:80%">
                    <h1>COMMANDE N°:<?= $commande['reference']; ?></h1>
                </td>

                <td style="width:20%" class="right">Émis le 
    <?= $commande['dateCre']; ?></td>
            </tr>
        </table>

        <table class="border" style="margin-top:10mm;">
            <thead>
                <tr>
                    <th>RÉF</th>
                    <th>DÉSIGNATION</th>
                    <th>QTT</th>
                    <th>PRIX.U HT</th>
                    <th>TVA</th>
                    <th>MONTANT HT</th>

                </tr>
            </thead>
            <tbody>
    <?php
    foreach ($ListeElements as $element) {
        ?>
                    <tr>
                        <td style="width:18%;"><?= $reference = $element['reference']; ?></td>

                        <td style="width:20%;"><?= $element['description']; ?></td>

                        <td style="width:5%;"><?= $element['qte']; ?></td>

                        <td style="width:20%;"><?= number_format($element['prixV'], 2)." ".$currency; ?> </td>

                        <td style="width:5%;"><?= $element['tva']; ?></td>

                        <td style="width:20%;"><?= number_format($element['total'], 2)." ".$currency; ?></td>
                    </tr>
    <?php } ?>

                <tr>
                    <td colspan="4" class="noborder" style="padding:2mm;"></td>
                    <td class="black" style="padding:2mm;border-right:none;">TOTAL HT </td>
                    <td style="padding:2mm;" colspan="1"><?= number_format($commande['totalallht'], 2)." ".$currency; ?> </td>
                </tr>

                <tr>
                    <td colspan="4" class="noborder" style="padding:2mm;"></td>
                    <td class="black" style="padding:2mm;border-right:none;">TOTAL TVA </td>
                    <td style="padding:2mm;" colspan="1"><?= number_format($commande['totalalltva'], 2)." ".$currency; ?> </td>
                </tr>
            </tbody>
        </table>

        <table style="vertical-align:top;margin-top:5mm;">
            <tr>
                <td style="width:50%">
                    <strong>Mode de paiment : </strong>
    <?= "Espèce"; ?><br/><br/>
                    <label style="text-align:left;">Nombre d'articles :</label>
                    <label> 
    <?= count($ListeElements); ?>
                    </label><br/>

                    <label style="text-align:left;">TOTAL TTC :</label>
                    <label> 
    <?= number_format($commande['totalttc'], 2)." ".$currency ?>
                    </label><br/><br/>

                    <strong>Livraison : </strong><br/>
                    Jour de livraison : <?= date(' d /m /Y') . "<br/>"; ?><br/>

                    <strong>Signature et cachet de la Société :</strong>
                </td>

            </tr>
        </table>
    </page>
    <?php
    $content = ob_get_clean();
    try {
        //On declare un nouvel objet
        $pdf = new HTML2PDF('P', 'A4', 'fr', true, 'UTF-8', 0);
        $pdf->pdf->SetDisplayMode('fullpage');
        $pdf->writeHTML($content);

        $url = $_SERVER['DOCUMENT_ROOT'] . $rootDir.'companies/' . $societe['nomSoc'];
        $type = '/docs/achats/commande/';
        $pdf->Output($url . $type . 'commande n' . $commande['reference'] . '.pdf', 'f');
        echo 'companies/' . $societe['nomSoc'] . $type . 'commande n' . $commande['reference'] . '.pdf';
    } catch (HTML2PDF_exception $e) {
        die($e);
    }
} else {
    echo "Erreur";
}