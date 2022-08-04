import React from "react";
import "./MatchingReport.css";
import "react-accessible-accordion/dist/fancy-example.css";

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { useState, useEffect } from "react";
import Axios from "axios";

const fetchpossales = (uswgp) => {
  console.log(uswgp);
};

const MatchingReport = ({ posdata, matchingpossales }) => {
  // useEffect(() => {
  //   if (poslist) {
  //     Axios.post("/usinventoryupdates", { poslist });
  //   }
  // }, []);
  return (
    <div className="matchreport">
      {posdata
        ? posdata.map((item) => (
            <Accordion
              allowZeroExpanded={true}
              className="matchaccordion"
              onChange={(e) => {
                fetchpossales(item.USWGP);
              }}
            >
              <AccordionItem>
                <AccordionItemHeading>
                  <AccordionItemButton className="matchaccordion_button">
                    <ul>
                      <li>USWGP: {item.USWGP}</li>
                      <li>Quantity: {item.quantity}</li>
                      <li>Inventory: {item.inventory ? item.inventory : 0}</li>
                    </ul>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <ul className="matchpossales">
                    <li className="matchpossalesheader">
                      <p>WGS</p>
                      <p>Customer</p>
                      <p>Quantity</p>
                    </li>
                    {matchingpossales
                      ? matchingpossales.map((x) =>
                          x.KTP === item.USWGP ? (
                            <li>
                              <p>{x.KTS}</p>
                              <p>{x.companyCode}</p>
                              <p>{x.quantity}</p>
                            </li>
                          ) : (
                            ""
                          )
                        )
                      : ""}
                  </ul>
                </AccordionItemPanel>
              </AccordionItem>
            </Accordion>
          ))
        : ""}
    </div>
  );
};

export default MatchingReport;
