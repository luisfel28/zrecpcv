sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
function (Controller, MessageToast, MessageBox) {
    "use strict";

    var Filtro          = [];
    var sBukrs          = "";
    var sRecnnr         = "";

    return Controller.extend("fidelidademundial.com.zrecpcv.controller.criacao", {
        
        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("Routecriacao").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched : function (oEvent) {

            var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZRE_GW_CPCV_SRV", true);
            
            var vObj        = "";

            sBukrs = oEvent.getParameter("arguments").bukrs;  // Empresa
            Filtro.push(new sap.ui.model.Filter("Bukrs", "EQ",sBukrs));

            sRecnnr = oEvent.getParameter("arguments").recnnr;  // Contrato Reserva
            Filtro.push(new sap.ui.model.Filter("Recnnr", "EQ",sRecnnr));

           
            oModel.read("/EntConditionsSet", {
                urlParameters: {
                    "$top": 9999
                },
                success: function (oData, oResponse) {
                    this.WriteData(oData);
                }.bind(this),
                error: function (err) {
                    
                },
                filters: Filtro
            }
            );
            
            var vLblBukrs = this.getView().byId("lblBukrs");
            vLblBukrs.setText(sBukrs);

            var vLblRecnnr = this.getView().byId("lblRecnnr");
            vLblRecnnr.setText(sRecnnr);

            var vLblPartner = this.getView().byId("lblPartner");
            vLblPartner.setText(oEvent.getParameter("arguments").partner);            

            oModel.read("/EntCPCVSet(Bukrs='"+sBukrs+"',Recnnr='"+sRecnnr+"')", {
                success: function (oDataCont, oResponseCont) {
                    this.WriteDataCabec(oDataCont, oResponseCont);
                }.bind(this),
                error: function (err) {
                    
                },
                filters: Filtro
            }
            );

        },

        handleContract: function (evt) {

            // Empresa
            var vBUKRS = this.getView().byId("lblBukrs").getText().toString();

            // Contrato
            var vCONT;
            vCONT = evt.getSource().getProperty("text").toString();

            var finalUrl = window.location.href.split("#")[0] + "#REContract-manageContract?CompanyCode="+vBUKRS+"&RealEstateContract="+vCONT+"&REContract="+vCONT+"&DynproNoFirstScreen=1";
            sap.m.URLHelper.redirect(finalUrl, false);

        },

        handleBP: function (evt) {

            // Business Partner
            var vBP = evt.getSource().getProperty("text").toString();

            var finalUrl = window.location.href.split("#")[0] + "#BusinessPartner-display?BusinessPartner="+vBP+"&sap-ach=FIN-FSCM-TRM";
            sap.m.URLHelper.redirect(finalUrl, false);

        },

        WriteData: function (results) {

            var oTable = this.getView().byId("TabConditions");
            var oModel = new sap.ui.model.json.JSONModel();

            oModel.setData(results);
            oTable.setModel(oModel);
            Filtro = [];

        },   

        WriteDataCabec: function (odata,oresponse) {

            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(odata);

            var oView = this.getView();
            oView.setModel(oModel, "dadoscabec");
            
            /// DENOMINAÇÃO CONTRATO
            var vLblRecnTxt = this.getView().byId("lblRecnTxt");
            var vRecnTxt    = oresponse.data.Recntxt;                    

            if ( vRecnTxt == "" )
            { vRecnTxt = "-" }

            vLblRecnTxt.setText(vRecnTxt);

/*             var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "dd/MM/yyyy"
            }); */

            /// FIM CONTRATO
            var vLblFimCont = this.getView().byId("lblValDtFimReserva");
            var vDtFimCont    = oresponse.data.Recnend1stcpcv;      

            if ( vDtFimCont == null )
                { 
                    vDtFimCont = "-" 
                    vLblFimCont.setText(vDtFimCont);
                }            

        },   

        onCreateContCPCV: function () {

            var oModel  = this.getView().getModel();

            var vTabConditions = this.getView().byId("TabConditions");
            
            var vTxtDtIni = this.getView().byId("TxtDtIni");
            var vTxtDtFim = this.getView().byId("TxtDtFim");

            var oContratoCPCV       = [],
                oConditionsCPCV     = [];

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);                 

            for (var vCont = 0; vCont < vTabConditions._iBindingLength; vCont++ )
            {

                // CONDIÇÕES CONTRATO CPCV
                var aDadosConditions = {
                    "Bukrs" : vTabConditions.getContextByIndex(vCont).getObject().Bukrs,
                    "Recnnr" :  vTabConditions.getContextByIndex(vCont).getObject().Recnnr,
                    "Condtype" :  vTabConditions.getContextByIndex(vCont).getObject().Condtype, 
                    "Condvalidfrom" :  vTabConditions.getContextByIndex(vCont).getObject().Condvalidfromcpcv,
                    "Condpurposeext" :  vTabConditions.getContextByIndex(vCont).getObject().Condpurposeextcpcv,
                    "Distrule" :  vTabConditions.getContextByIndex(vCont).getObject().Distrulecpcv
                };
                oConditionsCPCV.push(aDadosConditions);

            }

            // Dt Início Contrato
            var vDtIni = new Date(vTxtDtIni.getDateValue());

            // Acerta UTC caso necessário
/*             if ( vDtIni.getDate() != vDtIni.getUTCDate() )
            {
                vDtIni.setUTCDate(vDtIni.getDate());
            } */
            
            // Dt Fim Contrato
            var vDtFim = new Date(vTxtDtFim.getDateValue()); 

            // Acerta UTC caso necessário
/*              if ( vDtFim.getDate() != vDtFim.getUTCDate() )
            {
                //vDtFim.setUTCDate(vDtFim.getDate());
                vDtFim.setUTCDate(vDtFim.getUTCDate());
            } */


            
            // DADOS CONTRATO CPCV
            var aDadosContrato = {
                "Bukrs" : sBukrs,
                "Recnnr" :  sRecnnr,
                "Recnbeg" : vDtIni,
                "Recnend1st" : vDtFim,
                "EntConditionsSet" : oConditionsCPCV
            };

            oContratoCPCV.push(aDadosContrato);
                
            oModel.create("/EntCPCVSet", aDadosContrato, {
                success: function (odata, oResponse) {

                    var vBukrsContVenda     = oResponse.data.Bukrs;
                    var vRecnnrContVenda    = oResponse.data.Recnnr;

                    if ( vRecnnrContVenda != "" )
                    {
                    var mSuc = "Contrato de venda " + vBukrsContVenda + "/" + vRecnnrContVenda + " criado com sucesso!";
                    
                    // Atualiza tabela de Contratos
                    $.sap.gTabCont.getBinding("rows").refresh();

                    // Preenche mensagem de confirmação
                    $.sap.gConfirmation.setText(mSuc);
                    $.sap.gConfirmation.setProperty("visible", true);

                    oRouter.navTo("Routecontratos");               
                    }
                    else
                    {
                        //MessageToast.show("Erro na criação do contrato. Verifique as informações!");    
                        MessageBox.error(oResponse.data.Msg);
                    }

                },
                error: function (oError) {
                    //MessageToast.show(oError.responseText);
                    MessageToast.show(oResponse.data.Msg);
                }
            } );             

            
                 

        }   

    });
});
