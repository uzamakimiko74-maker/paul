"""Longer script: every old sentence kept verbatim (so existing shots keep their sentence), plus new sentences inserted after given old indices."""
import json
OLD = {int(k): v for k, v in json.load(open('/home/user/paul/ragnarok/work/old_sents.json')).items()}
PARA_END_OLD = {1:{1,3,5,6},2:{0,2},3:{0,3,6,9,10,14,15,20,22,23},4:{2,4,7,10,14},5:{1,7,12,16,19,22,25},6:{3,4,5,8,12,14},7:{6,8,9,11,12}}
# (id, text, ends_paragraph)
INS = {
 2: {0: [('a1', "The oldest copy of the Poetic Edda is a calfskin manuscript called the Codex Regius, written around twelve seventy.", 0),
         ('a2', "In Völuspá, the seeress tells Odin what she sees coming, and she keeps asking him one question, like a drumbeat: do you understand yet?", 0),
         ('a3', "Snorri was no monk. He was a powerful Icelandic chieftain and poet, and he wrote his Edda as a handbook for poets who wanted to understand the old stories.", 1)],
     2: [('a4', "The word Ragnarök itself means the fate of the gods, though some manuscripts say the twilight of the gods, and that small difference tells you how messy these sources are.", 1)]},
 3: {0: [('b1', "Ragnarök does not begin with a battle. It begins with a funeral.", 1)],
     2: [('b2', "Fire swears, and water, and iron, and every metal. Stones swear, and trees, and diseases, and every beast, bird, and snake.", 1)],
     6: [
         ('b4', "And they cannot take revenge, because the place is sacred ground.", 1)],
     9: [('b5', "Odin understands what this means. In the seeress's vision, Baldur's death is the first crack in the world.", 1)],
     14: [('c1', "To understand why, you need to know Loki's children.", 0),
          ('c2', "Loki fathered three monsters with a giantess: the wolf Fenrir, the world serpent Jormungandr, and Hel, who is half living and half dead.", 0),
          ('c3', "Odin hurled the serpent into the sea, where it grew until it circled the whole earth and bit its own tail.", 0),
          ('c5', "And the gods raised Fenrir themselves, until he grew so huge that they were afraid.", 0),
          ('c7', "So they asked the dwarves for a ribbon called Gleipnir, made from the sound of a cat's footsteps, the beard of a woman, the roots of a mountain, and the breath of a fish.", 0),
          ('c8', "Fenrir smelled a trick. He agreed to be tied only if one god put a hand in his mouth as a pledge. Only Týr dared.", 0),
          ('c9', "The ribbon held. Fenrir bit down. And Týr lost his right hand, but the wolf stayed bound until the end of the world.", 1)],
     20: [('b6', "The seeress describes the world before the end like this: an age of axes, an age of swords, shields split in two, an age of wind, an age of wolves, before the world crashes down.", 0),
          ('b7', "Everything that holds a society together is cut away, one thing at a time.", 1)]},
 4: {2: [('d1', "Their names are Sköll and Hati. Sköll takes the sun, and Hati takes the moon.", 1)],
     5: [('d2', "Flames burn from his eyes and nostrils.", 0)],
     8: [],
     10: [('d4', "Bifrost is the only road between heaven and earth. And now it is gone.", 1)],
     12: [('d5', "That well is where Odin once gave up an eye for wisdom. Now he asks it for advice one last time.", 1)],
     13: [('d6', "In Valhalla, Odin's hall, there are five hundred and forty doors, and eight hundred warriors can march through each one side by side.", 1)]},
 5: {1: [('e1', "The odds are not even. Gods who can die against monsters who cannot be reasoned with, and every one of them knows exactly how it ends.", 1)],
     4: [('e2', "The father of the gods is gone, exactly as the prophecy said.", 0)],
     9: [('e3', "Their last meeting was out at sea, when Thor used an ox head as bait and hauled the whole serpent up to his boat.", 0)],
     15: [('e4', "That sword could fight by itself, and without it, even a god can run out of luck.", 0)],
     18: [],
     22: [('e6', "Heimdall, who sees for a hundred miles and hears the grass grow, never saw this one coming.", 1)],
     24: [('e7', "The gods who held the world together are gone, and what is left will burn.", 1)]},
 6: {5: [('f1', "Waterfalls tumble from the new hills, and an eagle flies over them, hunting fish.", 1)],
     6: [],
     7: [],
     10: [('f4', "They survived by hiding in a wood called Hoddmimir's Holt, living on the morning dew.", 1)],
     11: [('f5', "In that hall, the seeress says, there is joy forever.", 1)],
     14: [('f6', "Then the seeress sinks back down, and the vision ends.", 1)]},
 7: {2: [('g1', "Odin spent his whole life collecting knowledge to escape this fate. He hung from a tree, gave up an eye, and still could not change it.", 1)],
     6: [('g2', "There is a famous line in the Havamal: cattle die, kinsmen die, you yourself will die, but fame never dies for the one who earns a good name.", 1)],
     8: [('g3', "Some scholars think the rebirth was shaped by Christian ideas, and some think it is much older. Nobody can prove it.", 1)]},
}
def build():
    out = {}
    for sec in range(1, 8):
        items = []
        for k, t in enumerate(OLD[sec]):
            items.append(dict(id=str(k), text=t, para=int(k in PARA_END_OLD[sec])))
            for (nid, nt, pe) in INS.get(sec, {}).get(k, []):
                items[-1]['para'] = 0 if True else items[-1]['para']  # a new group follows: the old sentence no longer ends the paragraph...
                items.append(dict(id=nid, text=nt, para=pe))
            # restore: old paragraph end belongs to the last sentence of the group
        out[sec] = items
    return out
if __name__ == '__main__':
    S = build()
    tot = 0
    for sec, items in S.items():
        w = sum(len(i['text'].split()) for i in items); tot += w
        print(sec, len(items), 'sentences', w, 'words')
    print('total words', tot)
    json.dump(S, open('/home/user/paul/ragnarok/work/script2.json', 'w'), ensure_ascii=False, indent=0)
