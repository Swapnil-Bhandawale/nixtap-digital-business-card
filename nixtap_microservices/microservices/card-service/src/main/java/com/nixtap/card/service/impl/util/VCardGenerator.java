package com.nixtap.card.service.impl.util;

import ezvcard.Ezvcard;
import ezvcard.VCard;
import ezvcard.property.StructuredName;
import org.springframework.stereotype.Component;

@Component
public class VCardGenerator {
    public String generate(String fullName, String email) {
        VCard vcard = new VCard();
        StructuredName n = new StructuredName();
        n.setFamily(fullName);
        vcard.setStructuredName(n);
        vcard.addEmail(email);
        return Ezvcard.write(vcard).go();
    }
}
